# Vital AI — Medical Report Understanding Platform

Vital AI transforms complex laboratory reports and diagnostic tests into clear, empathetic, and actionable insights for patients.

---

## 🏥 Key Features

1. **Smart Report Ingestion**: Upload PDF or image-based medical reports (CBC, Lipid Panel, Metabolic/Kidney profiles, HbA1c, etc.).
2. **Biomarker Extraction**: Automatically extracts test names, observed values, reference intervals, and measurement units.
3. **Visual Status Indicators**: Color-coded categorization for **Normal**, **Low**, **High**, and **Critical** biomarkers.
4. **Patient-Friendly Explanations**: Converts clinical jargon into simple, reassuring language explaining what each biomarker measures and what out-of-range values typically mean.
5. **Doctor Consultation Prep**: Generates personalized, targeted questions for patients to ask during their next physician visit.
6. **Report-Grounded Q&A**: An interactive chat assistant strictly bounded to the patient's uploaded report to answer follow-up questions.
7. **Safety & Privacy Guardrails**:
   - Prominent clinical disclaimer (educational assistance, not diagnostic medical advice).
   - Red-flag urgency banners advising immediate medical attention for critical values.
   - Privacy-focused: Local data management and one-click data deletion.

---

## 🏗️ Architecture

```
VitalAI/
├── frontend/               # React + Vite + Tailwind CSS + Lucide Icons
│   ├── src/
│   │   ├── components/     # ReportViewer, BiomarkerCard, ConsultPrep, ChatAssistant
│   │   ├── data/           # Sample medical reports (CBC, Lipid, Metabolic)
│   │   └── types/          # TypeScript definitions for medical reports & biomarkers
│   └── package.json
└── backend/                # FastAPI (Python 3)
    ├── app/
    │   ├── api/            # Endpoints: /upload, /parse, /explain, /consult-prep, /chat
    │   ├── models/         # Pydantic schemas (Report, Biomarker, UrgencyLevel)
    │   ├── prompts/        # Medical LLM prompt templates & clinical guardrails
    │   └── services/       # Extraction, OCR fallback, LLM reasoning engine
    └── requirements.txt
```

---

## 🚀 Getting Started on macOS

### 1. Prerequisites (macOS)
- **Xcode Command Line Tools**: Run `xcode-select --install` in Terminal.
- **Homebrew** (recommended): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- **Node.js** (v18+): `brew install node`
- **Python** (3.10+): `brew install python`

### 2. Running Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Running Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

