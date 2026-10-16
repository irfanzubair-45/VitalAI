import json
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Dict, Any

# Load a lightweight instruction model (CPU‑only). Feel free to replace with a larger model later.
_MODEL_NAME = "google/flan-t5-small"

def _load_model():
    tokenizer = AutoTokenizer.from_pretrained(_MODEL_NAME)
    model = AutoModelForSeq2SeqLM.from_pretrained(_MODEL_NAME)
    # Put model on CPU (or GPU if available)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    return tokenizer, model, device

_tokenizer, _model, _device = _load_model()

def generate_report_structure(raw_text: str) -> Dict[str, Any]:
    """Generate a JSON structure matching the VitalAI `MedicalReport` schema.

    The prompt asks the model to output a JSON object. The function parses the
    model's text output and returns a Python dict.
    """
    prompt = (
        "You are a medical report extraction assistant. Extract the following fields from the given report text and output a JSON object that matches the VitalAI schema: \n"
        "- title (string)\n"
        "- reportDate (string)\n"
        "- patientName (string or null)\n"
        "- labName (string or null)\n"
        "- category (string)\n"
        "- overallSummary (string)\n"
        "- urgencyLevel (routine, follow_up, urgent)\n"
        "- urgencyReason (string or null)\n"
        "- biomarkers (list of objects) with keys: id, name, category, value, numericValue, unit, referenceRange (min, max, text), status, confidence, simpleExplanation, clinicalContext, potentialReasons, recommendedQuestions\n"
        "- doctorQuestions (list of objects) with keys: id, question, context, category, priority, checked\n"
        "Report text:\n"
        f"{raw_text}\n"
        "Make sure the JSON is syntactically correct and does not contain any extra explanations."
    )
    inputs = _tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024).to(_device)
    # Generate with deterministic settings; increase token limit and handle missing JSON
    output_ids = _model.generate(
        **inputs,
        max_new_tokens=2048,
        do_sample=False,
        early_stopping=True,
    )
    output_text = _tokenizer.decode(output_ids[0], skip_special_tokens=True)
    # Find first JSON object in the output
    json_start = output_text.find('{')
    if json_start == -1:
        # As a fallback, try to treat the whole output as JSON
        json_str = output_text.strip()
    else:
        json_str = output_text[json_start:]
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON from model output: {e}\nOutput was: {output_text}")

