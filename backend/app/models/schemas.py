from enum import Enum
from typing import Optional, List, Union
from pydantic import BaseModel, Field


class BiomarkerStatus(str, Enum):
    NORMAL = "normal"
    LOW = "low"
    HIGH = "high"
    CRITICAL = "critical"


class ReferenceRange(BaseModel):
    min: Optional[float] = None
    max: Optional[float] = None
    text: str


class Biomarker(BaseModel):
    id: str
    name: str
    category: str
    value: Union[float, int, str]
    numericValue: Optional[float] = None
    unit: str
    referenceRange: ReferenceRange
    status: BiomarkerStatus
    confidence: float = 1.0  # 1.0 = high confidence, lower values indicate uncertainty
    simpleExplanation: str
    clinicalContext: str
    potentialReasons: Optional[List[str]] = Field(default_factory=list)
    recommendedQuestions: Optional[List[str]] = Field(default_factory=list)


class DoctorQuestion(BaseModel):
    id: str
    question: str
    context: str
    category: str
    priority: str = "medium"  # high, medium, routine
    checked: bool = False


class MedicalReport(BaseModel):
    id: str
    title: str
    reportDate: str
    patientName: Optional[str] = None
    labName: Optional[str] = None
    category: str
    overallSummary: str
    urgencyLevel: str = "routine"  # routine, follow_up, urgent
    urgencyReason: Optional[str] = None
    biomarkers: List[Biomarker]
    doctorQuestions: List[DoctorQuestion]


class ChatMessageSchema(BaseModel):
    id: Optional[str] = None
    sender: str
    text: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    reportId: str
    question: str
    history: List[ChatMessageSchema] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    sources: Optional[List[str]] = None

