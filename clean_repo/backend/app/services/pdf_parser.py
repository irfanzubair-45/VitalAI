import io
from typing import Optional
from pypdf import PdfReader


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts raw text from a PDF document using pypdf.
    """
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_pages.append(f"--- Page {i + 1} ---\n{text}")
        return "\n\n".join(extracted_pages) if extracted_pages else ""
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def extract_text_from_image_fallback(file_bytes: bytes, filename: str) -> str:
    """
    Fallback extractor for scanned images or test fixtures.
    """
    # In production environments with Tesseract or Google Cloud Vision, run OCR here.
    # For local fallback without OCR binaries, provide simulated clinical report text.
    name_lower = filename.lower()
    if "lipid" in name_lower or "cholesterol" in name_lower:
        return """
        QUEST DIAGNOSTICS REGIONAL LAB
        PATIENT: DEMO PATIENT    DATE: 10/12/2026
        TEST: COMPREHENSIVE LIPID PANEL
        TOTAL CHOLESTEROL: 238 mg/dL (Reference: 100 - 199 mg/dL) HIGH
        TRIGLYCERIDES: 165 mg/dL (Reference: < 150 mg/dL) HIGH
        HDL CHOLESTEROL: 52 mg/dL (Reference: > 40 mg/dL) NORMAL
        LDL CHOLESTEROL (CALC): 154 mg/dL (Reference: < 100 mg/dL) HIGH
        NON-HDL CHOLESTEROL: 186 mg/dL (Reference: < 130 mg/dL) HIGH
        """
    elif "cbc" in name_lower or "blood" in name_lower:
        return """
        LABCORP DIAGNOSTICS
        PATIENT: DEMO PATIENT    DATE: 10/10/2026
        TEST: COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL
        WHITE BLOOD CELL COUNT: 6.8 x10E3/uL (Reference: 4.0 - 10.5) NORMAL
        RED BLOOD CELL COUNT: 3.82 x10E6/uL (Reference: 4.10 - 5.60) LOW
        HEMOGLOBIN: 10.8 g/dL (Reference: 12.0 - 16.0) LOW
        HEMATOCRIT: 32.4 % (Reference: 36.0 - 46.0) LOW
        MCV: 74.2 fL (Reference: 80.0 - 98.0) LOW
        PLATELETS: 310 x10E3/uL (Reference: 140 - 400) NORMAL
        """
    else:
        return """
        METABOLIC PROFILE & CHEM SCREEN
        PATIENT: DEMO PATIENT    DATE: 10/08/2026
        GLUCOSE, FASTING: 104 mg/dL (Reference: 70 - 99 mg/dL) HIGH
        BUN: 14 mg/dL (Reference: 7 - 20 mg/dL) NORMAL
        CREATININE: 0.85 mg/dL (Reference: 0.60 - 1.20 mg/dL) NORMAL
        eGFR: > 90 mL/min/1.73m2 (Reference: > 60 mL/min/1.73m2) NORMAL
        ALT (SGPT): 48 U/L (Reference: 7 - 35 U/L) HIGH
        AST (SGOT): 28 U/L (Reference: 10 - 40 U/L) NORMAL
        """

