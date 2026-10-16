import time
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.schemas import MedicalReport, ChatRequest, ChatResponse
from app.services.pdf_parser import extract_text_from_pdf, extract_text_from_image_fallback
from app.services.llm_service import llm_service
import pathlib, uuid
from app.utils.crypto import encrypt_bytes

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Vital AI Backend",
        "timestamp": time.time(),
    }


@router.post("/upload", response_model=MedicalReport)
async def upload_report(file: UploadFile = File(...)):
    """
    Accepts medical report file (PDF, PNG, JPG), extracts text,
    and returns a structured MedicalReport with biomarkers, explanations, and questions.
    """
    filename = file.filename or "unknown_report.pdf"
    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Extract text based on file format
    if filename.lower().endswith(".pdf"):
        raw_text = extract_text_from_pdf(content)
        if not raw_text.strip():
            # If PDF has no extractable text stream (scanned PDF), use fallback OCR text
            raw_text = extract_text_from_image_fallback(content, filename)
    else:
        # Scanned image format (PNG, JPG)
        raw_text = extract_text_from_image_fallback(content, filename)

    # Encrypt and store the uploaded file
    encrypted = encrypt_bytes(content)
    upload_dir = pathlib.Path('uploads')
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / f"{uuid.uuid4().hex}.enc"
    file_path.write_bytes(encrypted)

    # Parse with LLM service using raw text (still using original content for extraction)
    report = await llm_service.parse_medical_report(raw_text, filename=filename)
    return report


@router.post("/chat", response_model=ChatResponse)
async def chat_with_copilot(request: ChatRequest):
    """
    Answers grounded questions strictly bounded to the active medical report.
    """
    reply = await llm_service.answer_chat(
        question=request.question,
        report_id=request.reportId,
        history=request.history,
    )
    return ChatResponse(reply=reply)

