import re
import json
import uuid
from typing import Optional, List, Dict, Any, Tuple
from app.core.config import settings
from app.models.schemas import MedicalReport, Biomarker, ReferenceRange, BiomarkerStatus, DoctorQuestion, ChatMessageSchema
from app.prompts.clinical_prompts import MEDICAL_SYSTEM_PROMPT, EXTRACTION_PROMPT_TEMPLATE

# Comprehensive clinical knowledge base for real biomarker dynamic interpretation
BIOMARKER_DATABASE: Dict[str, Dict[str, Any]] = {
    # Hematology / Complete Blood Count (CBC)
    "hemoglobin": {
        "display": "Hemoglobin (Hgb)",
        "category": "Complete Blood Count",
        "unit": "g/dL",
        "default_min": 12.0, "default_max": 17.5,
        "explanation": "Hemoglobin is the oxygen-transporting protein packed inside your red blood cells.",
        "clinical": "Essential for systemic oxygenation. Reduced levels signify anemia, which may cause fatigue or shortness of breath on exertion.",
        "factors": ["Dietary iron intake", "Chronic inflammation", "Recent blood donation or menstrual blood loss"],
        "questions": ["Should we check a serum ferritin and iron panel to see if my iron reserves are depleted?"]
    },
    "hematocrit": {
        "display": "Hematocrit (Hct)",
        "category": "Complete Blood Count",
        "unit": "%",
        "default_min": 36.0, "default_max": 50.0,
        "explanation": "The percentage of your total blood volume made up of red blood cells.",
        "clinical": "Closely tracks hemoglobin levels. Elevated numbers can occur with dehydration; low numbers indicate anemia.",
        "factors": ["Hydration status", "High altitude living", "Red blood cell production rate"],
        "questions": ["Is my hematocrit in proportion with my hydration level?"]
    },
    "wbc": {
        "display": "White Blood Cell Count (WBC)",
        "category": "Complete Blood Count",
        "unit": "x10E3/uL",
        "default_min": 4.0, "default_max": 11.0,
        "explanation": "White blood cells form your immune system's frontline defense against infection and inflammation.",
        "clinical": "Elevations frequently indicate the body is fighting a bacterial or viral infection, or acute physical stress.",
        "factors": ["Recent bacterial or viral illness", "Physical stress or exercise", "Medications (such as corticosteroids)"],
        "questions": ["Does my WBC elevation suggest an active underlying infection or inflammatory reaction?"]
    },
    "platelets": {
        "display": "Platelet Count",
        "category": "Complete Blood Count",
        "unit": "x10E3/uL",
        "default_min": 150.0, "default_max": 450.0,
        "explanation": "Platelets are microscopic cell fragments that form clots to stop bleeding when blood vessels are injured.",
        "clinical": "Critical for normal blood clotting. Low counts (thrombocytopenia) can cause easy bruising or bleeding.",
        "factors": ["Viral infections", "Medications", "Autoimmune conditions", "Bone marrow production"],
        "questions": ["Are my platelet levels sufficient to maintain normal blood clotting without bleeding risks?"]
    },
    "mcv": {
        "display": "Mean Corpuscular Volume (MCV)",
        "category": "Red Blood Cell Indices",
        "unit": "fL",
        "default_min": 80.0, "default_max": 100.0,
        "explanation": "MCV quantifies the average physical size of your individual red blood cells.",
        "clinical": "Low values ('microcytic') often indicate iron deficiency or thalassemia trait. High values ('macrocytic') point toward vitamin B12 or folate deficiency.",
        "factors": ["Iron availability during cell synthesis", "Vitamin B12 and Folate intake", "Thyroid function"],
        "questions": ["Does my MCV suggest a nutritional deficiency such as iron, B12, or folate?"]
    },
    "rbc": {
        "display": "Red Blood Cell Count (RBC)",
        "category": "Complete Blood Count",
        "unit": "x10E6/uL",
        "default_min": 4.0, "default_max": 5.9,
        "explanation": "The total count of oxygen-carrying red blood cells per volume of blood.",
        "clinical": "Used in combination with hemoglobin and hematocrit to evaluate for anemia or erythrocytosis.",
        "factors": ["Bone marrow activity", "Kidney erythropoietin production", "Hydration"],
        "questions": ["How does my overall RBC count correlate with my energy levels and iron status?"]
    },

    # Metabolic & Renal Panel (BMP / CMP)
    "glucose": {
        "display": "Blood Glucose (Fasting)",
        "category": "Metabolism & Blood Sugar",
        "unit": "mg/dL",
        "default_min": 70.0, "default_max": 99.0,
        "explanation": "Fasting blood sugar measures the concentration of glucose available for energy throughout your body.",
        "clinical": "Persistent elevations above 100 mg/dL warrant evaluation for pre-diabetes or diabetes via an HbA1c test.",
        "factors": ["Fasting duration prior to blood draw", "Carbohydrate consumption", "Acute illness or stress hormones"],
        "questions": ["Should we check an HbA1c test to assess my 3-month average blood glucose?"]
    },
    "creatinine": {
        "display": "Creatinine",
        "category": "Kidney Function (Renal)",
        "unit": "mg/dL",
        "default_min": 0.6, "default_max": 1.2,
        "explanation": "A natural waste byproduct of muscular metabolism continuously cleared by healthy kidneys.",
        "clinical": "A primary biomarker for kidney filtration efficacy. Increases may reflect reduced filtration or significant dehydration.",
        "factors": ["Muscle mass and strenuous workouts", "Hydration level", "Protein or creatine supplement intake"],
        "questions": ["Is my creatinine reading consistent with optimal kidney health, and would re-checking while well-hydrated be helpful?"]
    },
    "bun": {
        "display": "Blood Urea Nitrogen (BUN)",
        "category": "Kidney Function (Renal)",
        "unit": "mg/dL",
        "default_min": 7.0, "default_max": 20.0,
        "explanation": "Measures the amount of urea nitrogen in your blood, formed when protein is broken down.",
        "clinical": "Evaluated alongside creatinine to differentiate between dehydration and underlying kidney issues.",
        "factors": ["High protein diets", "Fluid and hydration status", "Digestive processing"],
        "questions": ["Does my BUN-to-creatinine ratio point towards simple dehydration?"]
    },
    "egfr": {
        "display": "eGFR (Estimated Glomerular Filtration Rate)",
        "category": "Kidney Function (Renal)",
        "unit": "mL/min/1.73m2",
        "default_min": 60.0, "default_max": 130.0,
        "explanation": "An estimate of how many milliliters of blood your kidneys purify every minute.",
        "clinical": "Values above 60 indicate normal or near-normal kidney function in most adults.",
        "factors": ["Serum creatinine level", "Age and biological sex", "Hydration status"],
        "questions": ["Does my eGFR indicate stable, robust kidney filtration?"]
    },
    "alt": {
        "display": "Alanine Aminotransferase (ALT)",
        "category": "Liver Function (Hepatic)",
        "unit": "U/L",
        "default_min": 7.0, "default_max": 45.0,
        "explanation": "An enzyme primarily situated within liver cells that enters the bloodstream if liver cells experience strain.",
        "clinical": "Mild increases are commonly seen in metabolic fatty liver, recent heavy muscular exercise, or medication usage.",
        "factors": ["Recent vigorous exercise", "Alcohol or medication intake (e.g. Tylenol, statins)", "Metabolic health"],
        "questions": ["What follow-up or lifestyle steps do you recommend to normalize this ALT level?"]
    },
    "ast": {
        "display": "Aspartate Aminotransferase (AST)",
        "category": "Liver Function (Hepatic)",
        "unit": "U/L",
        "default_min": 10.0, "default_max": 40.0,
        "explanation": "An enzyme found in liver cells, cardiac tissue, and skeletal muscles.",
        "clinical": "Evaluated alongside ALT. A mild elevation alongside normal ALT often originates from skeletal muscle exertion.",
        "factors": ["Intense muscle exertion", "Liver irritation", "Medications"],
        "questions": ["Could my AST number reflect physical activity or medication rather than liver issues?"]
    },
    "sodium": {
        "display": "Sodium",
        "category": "Electrolytes",
        "unit": "mmol/L",
        "default_min": 135.0, "default_max": 145.0,
        "explanation": "A vital electrolyte maintaining fluid balance and electrical signaling across nerve and muscle cells.",
        "clinical": "Abnormalities can cause weakness, dizziness, or confusion, frequently tied to fluid intake or diuretics.",
        "factors": ["Water intake balance", "Diuretic medications", "Sodium consumption"],
        "questions": ["Are my electrolytes in balance, and do any of my medications influence sodium?"]
    },
    "potassium": {
        "display": "Potassium",
        "category": "Electrolytes",
        "unit": "mmol/L",
        "default_min": 3.5, "default_max": 5.2,
        "explanation": "An electrolyte crucial for heart rhythm regulation and muscle contraction.",
        "clinical": "Both high (hyperkalemia) and low (hypokalemia) levels require careful attention to prevent cardiac rhythm disruptions.",
        "factors": ["Kidney clearance", "Blood pressure medications (ACE inhibitors, ARBs)", "Dietary intake"],
        "questions": ["Does my potassium level remain safe for my current heart medications?"]
    },
    "calcium": {
        "display": "Calcium",
        "category": "Minerals & Bone Health",
        "unit": "mg/dL",
        "default_min": 8.5, "default_max": 10.5,
        "explanation": "An essential mineral required for bone integrity, neuromuscular signaling, and blood clotting.",
        "clinical": "Regulated by parathyroid hormone and vitamin D. Abnormalities prompt examination of parathyroid or bone metabolism.",
        "factors": ["Parathyroid gland activity", "Vitamin D levels", "Albumin protein level in blood"],
        "questions": ["Should we check a Vitamin D or PTH level to correlate with my calcium?"]
    },

    # Lipid & Cardiovascular Profile
    "cholesterol": {
        "display": "Total Cholesterol",
        "category": "Lipid & Cardiovascular Panel",
        "unit": "mg/dL",
        "default_min": 100.0, "default_max": 199.0,
        "explanation": "The cumulative amount of all cholesterol particles circulating in your bloodstream.",
        "clinical": "Provides a high-level marker of lipid status; interpreted together with HDL, LDL, and triglycerides.",
        "factors": ["Saturated fat intake", "Familial genetics", "Physical activity"],
        "questions": ["What is my overall cardiovascular risk calculation based on this cholesterol reading?"]
    },
    "ldl": {
        "display": "LDL Cholesterol",
        "category": "Lipid & Cardiovascular Panel",
        "unit": "mg/dL",
        "default_min": 0.0, "default_max": 99.0,
        "explanation": "Low-Density Lipoprotein, known as 'bad cholesterol' because it can contribute to arterial plaque deposits.",
        "clinical": "Primary therapeutic target in cardiovascular risk reduction. Optimal levels vary based on overall personal risk.",
        "factors": ["Dietary saturated and trans fats", "Genetic predisposition", "Thyroid function"],
        "questions": ["What is my personal target LDL goal, and should we try nutrition changes or medication?"]
    },
    "hdl": {
        "display": "HDL Cholesterol",
        "category": "Lipid & Cardiovascular Panel",
        "unit": "mg/dL",
        "default_min": 40.0, "default_max": 90.0,
        "explanation": "High-Density Lipoprotein, known as 'good cholesterol' for returning excess cholesterol to the liver.",
        "clinical": "Higher numbers are generally protective against atherosclerosis.",
        "factors": ["Aerobic exercise", "Dietary healthy fats (olive oil, omega-3s)", "Smoking cessation"],
        "questions": ["What lifestyle strategies can help support or raise my protective HDL levels?"]
    },
    "triglycerides": {
        "display": "Triglycerides",
        "category": "Lipid & Cardiovascular Panel",
        "unit": "mg/dL",
        "default_min": 0.0, "default_max": 149.0,
        "explanation": "Blood fats that store unused calories; elevated levels can contribute to cardiovascular risk.",
        "clinical": "Very sensitive to dietary sugars, carbohydrates, alcohol consumption, and fasting status.",
        "factors": ["Simple carbohydrate/sugar intake", "Alcohol consumption", "Non-fasting blood draw"],
        "questions": ["Was my fasting duration adequate, and what dietary substitutions will best lower triglycerides?"]
    },

    # Endocrine & Miscellaneous
    "tsh": {
        "display": "Thyroid Stimulating Hormone (TSH)",
        "category": "Thyroid & Endocrine",
        "unit": "uIU/mL",
        "default_min": 0.4, "default_max": 4.5,
        "explanation": "A hormone produced by the pituitary gland that instructs your thyroid how much hormone to generate.",
        "clinical": "High TSH suggests an underactive thyroid (hypothyroidism); low TSH points toward overactivity (hyperthyroidism).",
        "factors": ["Thyroid autoimmune antibodies", "Iodine intake", "Stress or illness"],
        "questions": ["Does my TSH indicate that my thyroid is functioning at an optimal metabolic rate?"]
    },
    "hba1c": {
        "display": "Hemoglobin A1c (HbA1c)",
        "category": "Diabetes & Glucose Management",
        "unit": "%",
        "default_min": 4.0, "default_max": 5.6,
        "explanation": "A measure of the percentage of hemoglobin coated with sugar, reflecting your average blood sugar over the last 90 days.",
        "clinical": "Standard test for diagnosing and managing diabetes (5.7-6.4% indicates pre-diabetes; 6.5%+ indicates diabetes).",
        "factors": ["3-month dietary carbohydrate intake", "Insulin sensitivity", "Physical activity"],
        "questions": ["How does this HbA1c compare to my previous baseline, and what target should we aim for?"]
    },
    "ferritin": {
        "display": "Ferritin",
        "category": "Iron Stores",
        "unit": "ng/mL",
        "default_min": 20.0, "default_max": 250.0,
        "explanation": "A protein that stores iron inside your body's cells; the best measure of total iron reserves.",
        "clinical": "Low ferritin confirms iron deficiency even before overt anemia develops. High ferritin can reflect acute inflammation.",
        "factors": ["Dietary iron absorption", "Occult blood loss", "Systemic inflammatory state"],
        "questions": ["Do my ferritin stores indicate a need for iron supplementation or dietary modifications?"]
    }
}


class LLMService:
    def __init__(self):
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY

    async def parse_medical_report(self, raw_text: str, filename: str = "report.pdf") -> MedicalReport:
        """
        Parses raw report text from a real user document.
        Tries Gemini or OpenAI first if API keys exist.
        Otherwise executes a comprehensive, real dynamic pattern extraction engine!
        """
        if self.gemini_key:
            try:
                return await self._parse_with_gemini(raw_text)
            except Exception as e:
                print(f"Gemini API parse failed: {e}. Executing real dynamic extraction...")

        if self.openai_key:
            try:
                return await self._parse_with_openai(raw_text)
            except Exception as e:
                print(f"OpenAI API parse failed: {e}. Executing real dynamic extraction...")

        # Use dedicated model for extraction with fallback
        from app.services.model_service import generate_report_structure
        try:
            model_output = generate_report_structure(raw_text)
            if isinstance(model_output, dict) and model_output:
                return MedicalReport(**model_output)
        except Exception as e:  # pragma: no cover – defensive fallback
            print(f"Model extraction failed in parse_medical_report: {e}. Falling back to dynamic parser.")
        # Fallback to original dynamic parser
        return self._extract_real_biomarkers_from_text(raw_text, filename)

    async def _parse_with_gemini(self, raw_text: str) -> MedicalReport:
        from google import genai
        client = genai.Client(api_key=self.gemini_key)
        prompt = EXTRACTION_PROMPT_TEMPLATE.format(report_text=raw_text)
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        cleaned_json = self._clean_json(response.text)
        data = json.loads(cleaned_json)
        return MedicalReport(**data)

    async def _parse_with_openai(self, raw_text: str) -> MedicalReport:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=self.openai_key)
        prompt = EXTRACTION_PROMPT_TEMPLATE.format(report_text=raw_text)

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": MEDICAL_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        data = json.loads(response.choices[0].message.content or "{}")
        return MedicalReport(**data)

    def _extract_real_biomarkers_from_text(self, raw_text: str, filename: str) -> MedicalReport:
        """Extract a MedicalReport using the dedicated local model, falling back to the
        original dynamic parser if model inference fails or returns invalid data.
        """
        # --- Model‑first extraction -------------------------------------------------
        try:
            from app.services.model_service import generate_report_structure
            model_output = generate_report_structure(raw_text)
            if isinstance(model_output, dict):
                return MedicalReport(**model_output)
        except Exception as e:  # pragma: no cover – defensive fallback
            print(f"Model extraction failed: {e}. Using dynamic parser fallback.")

        # --- Dynamic parser fallback (original implementation) --------------------
        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        detected_biomarkers: List[Biomarker] = []
        seen_keys = set()

        for line in lines:
            line_clean = line.replace(",", ".")
            line_lower = line.lower()

            for key, info in BIOMARKER_DATABASE.items():
                if key in seen_keys:
                    continue
                pattern = rf"\\b{re.escape(key)}\\b"
                if re.search(pattern, line_lower) or (key == "wbc" and "white blood" in line_lower) or (key == "rbc" and "red blood" in line_lower):
                    extracted = self._parse_line_for_biomarker(line, key, info)
                    if extracted:
                        detected_biomarkers.append(extracted)
                        seen_keys.add(key)
                        break

        if not detected_biomarkers:
            detected_biomarkers = self._generic_row_parse(lines)

        high_count = sum(1 for b in detected_biomarkers if b.status == BiomarkerStatus.HIGH)
        low_count = sum(1 for b in detected_biomarkers if b.status == BiomarkerStatus.LOW)
        crit_count = sum(1 for b in detected_biomarkers if b.status == BiomarkerStatus.CRITICAL)
        out_of_range = high_count + low_count + crit_count

        if crit_count > 0:
            urgency = "urgent"
            urgency_reason = f"{crit_count} biomarker value(s) fall in critical ranges. Prompt review with a medical provider is recommended."
        elif out_of_range > 0:
            urgency = "follow_up"
            out_names = [b.name for b in detected_biomarkers if b.status != BiomarkerStatus.NORMAL]
            urgency_reason = f"Out-of-range results detected for {', '.join(out_names[:3])}. Non-urgent discussion with your doctor is advised."
        else:
            urgency = "routine"
            urgency_reason = "All evaluated laboratory parameters fall within standard expected reference intervals."

        title = self._detect_report_title(detected_biomarkers, filename)
        category = self._detect_primary_category(detected_biomarkers)
        summary = self._build_dynamic_summary(detected_biomarkers, out_of_range, high_count, low_count)
        doctor_questions = self._build_doctor_questions(detected_biomarkers)

        report_id = f"report-{uuid.uuid4().hex[:8]}"

        return MedicalReport(
            id=report_id,
            title=title,
            reportDate="Recent Test",
            patientName=self._extract_patient_name(raw_text),
            labName=self._extract_lab_name(raw_text),
            category=category,
            overallSummary=summary,
            urgencyLevel=urgency,
            urgencyReason=urgency_reason,
            biomarkers=detected_biomarkers,
            doctorQuestions=doctor_questions,
        )

    def _parse_line_for_biomarker(self, line: str, key: str, info: Dict[str, Any]) -> Optional[Biomarker]:
        """
        Extracts observed numeric value and reference range from a line of text.
        """
        # Find all numbers (including decimals)
        numbers = re.findall(r"[-+]?\d*\.?\d+", line)
        if not numbers:
            return None

        # Filter out numbers that look like dates or page numbers
        parsed_numbers = []
        for n in numbers:
            try:
                val = float(n)
                if val < 10000 and not (val > 1900 and val < 2100):  # avoid years like 2026
                    parsed_numbers.append(val)
            except ValueError:
                continue

        if not parsed_numbers:
            return None

        observed_val = parsed_numbers[0]
        ref_min = info.get("default_min")
        ref_max = info.get("default_max")
        ref_text = f"{ref_min} - {ref_max} {info['unit']}"

        # If line contains a range like "12.0 - 16.0" or "70-99"
        range_match = re.search(r"(\d+\.?\d*)\s*(?:-|to)\s*(\d+\.?\d*)", line)
        if range_match:
            try:
                r1 = float(range_match.group(1))
                r2 = float(range_match.group(2))
                ref_min = min(r1, r2)
                ref_max = max(r1, r2)
                ref_text = f"{ref_min} - {ref_max} {info['unit']}"
                # If observed value was matched as part of the range, look for other numbers
                if len(parsed_numbers) > 1 and observed_val in (r1, r2):
                    for pn in parsed_numbers:
                        if pn != r1 and pn != r2:
                            observed_val = pn
                            break
            except Exception:
                pass

        # Determine status
        status = BiomarkerStatus.NORMAL
        line_lower = line.lower()
        if "critical" in line_lower or "panic" in line_lower or "alert" in line_lower:
            status = BiomarkerStatus.CRITICAL
        elif "high" in line_lower or "h" in line.split() or (ref_max is not None and observed_val > ref_max):
            status = BiomarkerStatus.HIGH
        elif "low" in line_lower or "l" in line.split() or (ref_min is not None and observed_val < ref_min):
            status = BiomarkerStatus.LOW

        # Format questions
        rec_questions = info.get("questions", [])

        return Biomarker(
            id=key,
            name=info["display"],
            category=info["category"],
            value=observed_val,
            numericValue=observed_val,
            unit=info["unit"],
            referenceRange=ReferenceRange(min=ref_min, max=ref_max, text=ref_text),
            status=status,
            simpleExplanation=info["explanation"],
            clinicalContext=info["clinical"],
            potentialReasons=info.get("factors", []),
            recommendedQuestions=rec_questions
        )

    def _generic_row_parse(self, lines: List[str]) -> List[Biomarker]:
        """
        Fallback parser for unfamiliar lab tests found in user reports.
        """
        results = []
        for i, line in enumerate(lines[:15]):
            nums = re.findall(r"\b\d+\.?\d*\b", line)
            if nums and len(line) > 5 and not any(header in line.lower() for header in ["date", "patient", "doctor", "phone", "page"]):
                val = float(nums[0])
                words = [w for w in re.split(r"[^a-zA-Z]", line) if len(w) > 2]
                name = " ".join(words[:3]).title() if words else f"Biomarker {i+1}"
                results.append(
                    Biomarker(
                        id=f"bio-{i}",
                        name=name,
                        category="Diagnostic Analysis",
                        value=val,
                        numericValue=val,
                        unit="",
                        referenceRange=ReferenceRange(text="Standard Laboratory Range"),
                        status=BiomarkerStatus.NORMAL,
                        simpleExplanation=f"Extracted laboratory test reading from your uploaded report.",
                        clinicalContext="Individual lab results should be reviewed in the context of your complete medical history.",
                        potentialReasons=["Laboratory measurement"],
                        recommendedQuestions=[f"What does my {name} reading of {val} mean for my general health?"]
                    )
                )
        return results

    def _detect_report_title(self, biomarkers: List[Biomarker], filename: str) -> str:
        names = " ".join([b.name.lower() for b in biomarkers])
        if "cholesterol" in names or "ldl" in names:
            return "Comprehensive Lipid & Cardiovascular Profile"
        elif "hemoglobin" in names or "platelet" in names or "wbc" in names:
            return "Complete Blood Count (CBC) Panel"
        elif "glucose" in names or "creatinine" in names or "alt" in names:
            return "Metabolic & Comprehensive Organ Panel"
        elif filename and not filename.startswith("unknown"):
            return filename.replace(".pdf", "").replace(".png", "").replace(".jpg", "").replace("_", " ").title()
        return "Clinical Laboratory Report"

    def _detect_primary_category(self, biomarkers: List[Biomarker]) -> str:
        cats = [b.category for b in biomarkers]
        if cats:
            return max(set(cats), key=cats.count)
        return "General Laboratory Medicine"

    def _build_dynamic_summary(self, biomarkers: List[Biomarker], out_of_range: int, high_count: int, low_count: int) -> str:
        if not biomarkers:
            return "Your medical report was processed. No definitive clinical biomarkers were identified in the text."

        total = len(biomarkers)
        if out_of_range == 0:
            return f"Great news: All {total} evaluated biomarkers in your report fall cleanly within standard laboratory reference ranges. Key metabolic and organ function markers appear stable."

        out_list = [f"{b.name} ({b.value} {b.unit} - {b.status.value.upper()})" for b in biomarkers if b.status != BiomarkerStatus.NORMAL]
        out_str = ", ".join(out_list[:4])
        return (
            f"We evaluated {total} biomarkers from your report. While most baseline parameters are optimal, "
            f"{out_of_range} biomarker(s) fall outside expected intervals: {out_str}. "
            "These deviations are commonly evaluated by physicians to adjust nutrition, lifestyle, or follow-up testing."
        )

    def _build_doctor_questions(self, biomarkers: List[Biomarker]) -> List[DoctorQuestion]:
        questions = []
        out_biomarkers = [b for b in biomarkers if b.status != BiomarkerStatus.NORMAL]

        for idx, b in enumerate(out_biomarkers):
            if b.recommendedQuestions:
                questions.append(
                    DoctorQuestion(
                        id=f"dq-{idx+1}",
                        category=b.category,
                        priority="high",
                        question=b.recommendedQuestions[0],
                        context=f"Follow-up for observed {b.name} result of {b.value} {b.unit} ({b.status.value})."
                    )
                )

        if not questions:
            questions.append(
                DoctorQuestion(
                    id="dq-routine-1",
                    category="Wellness Review",
                    priority="routine",
                    question="Since my results are within standard ranges, when do you recommend our next routine checkup?",
                    context="Clarifies standard preventative screening timeline."
                )
            )

        return questions

    def _extract_patient_name(self, text: str) -> Optional[str]:
        match = re.search(r"(?:patient|name|patient name)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)", text, re.IGNORECASE)
        return match.group(1) if match else None

    def _extract_lab_name(self, text: str) -> Optional[str]:
        for lab in ["Quest Diagnostics", "Labcorp", "BioReference", "Mayo Clinic", "Sonic Healthcare"]:
            if lab.lower() in text.lower():
                return lab
        return None

    async def answer_chat(self, question: str, report_id: str, history: List[ChatMessageSchema]) -> str:
        """
        Answers grounded questions about the active real report.
        """
        if self.gemini_key:
            try:
                from google import genai
                client = genai.Client(api_key=self.gemini_key)
                prompt = f"{MEDICAL_SYSTEM_PROMPT}\n\nUser Question: {question}\nReport Context: Active Report ID {report_id}"
                resp = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
                return resp.text
            except Exception as e:
                print(f"Gemini chat failed: {e}")

        if self.openai_key:
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=self.openai_key)
                messages = [{"role": "system", "content": MEDICAL_SYSTEM_PROMPT}]
                for h in history[-5:]:
                    role = "user" if h.sender == "user" else "assistant"
                    messages.append({"role": role, "content": h.text})
                messages.append({"role": "user", "content": question})
                resp = await client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                )
                return resp.choices[0].message.content or "No response generated."
            except Exception as e:
                print(f"OpenAI chat failed: {e}")

        q_lower = question.lower()
        if "emergency" in q_lower or "danger" in q_lower or "urgent" in q_lower:
            return "Routine laboratory test results do not replace emergency clinical evaluation. If you or a loved one are experiencing acute symptoms—such as chest pain, sudden numbness, severe shortness of breath, or confusion—please seek emergency medical care (call 911) immediately."
        elif "cholesterol" in q_lower or "ldl" in q_lower:
            return "In your report, lipid markers reflect how fats circulate in your blood. Elevating soluble fiber (oats, legumes, vegetables) and healthy monounsaturated fats while decreasing saturated fats is a foundational approach physicians recommend before or alongside medication."
        elif "diet" in q_lower or "food" in q_lower:
            return "Dietary interventions have direct effects on metabolic, lipid, and liver values. Doctors frequently suggest Mediterranean-style eating patterns—rich in vegetables, fish, whole grains, and healthy oils—to support optimal biomarker levels."
        else:
            return f"Regarding '{question}': In laboratory medicine, each individual test is interpreted as part of a whole clinical picture alongside your personal health history, physical exam, and symptoms. I recommend discussing this specific topic during your next physician consultation."

    def _clean_json(self, text: str) -> str:
        text = re.sub(r"^```json\s*", "", text.strip())
        text = re.sub(r"^```\s*", "", text.strip())
        text = re.sub(r"```$", "", text.strip())
        return text.strip()


llm_service = LLMService()
