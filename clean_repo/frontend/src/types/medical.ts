export type BiomarkerStatus = 'normal' | 'low' | 'high' | 'critical';

export interface ReferenceRange {
  min?: number;
  max?: number;
  text: string;
}

export interface Biomarker {
  id: string;
  name: string;
  category: string;
  value: number | string;
  numericValue?: number;
  unit: string;
  referenceRange: ReferenceRange;
  status: BiomarkerStatus;
  simpleExplanation: string;
  clinicalContext: string;
  potentialReasons?: string[];
  recommendedQuestions?: string[];
}

export interface DoctorQuestion {
  id: string;
  question: string;
  context: string;
  category: string;
  priority: 'high' | 'medium' | 'routine';
  checked?: boolean;
}

export interface MedicalReport {
  id: string;
  title: string;
  reportDate: string;
  patientName?: string;
  labName?: string;
  category: string;
  overallSummary: string;
  urgencyLevel: 'routine' | 'follow_up' | 'urgent';
  urgencyReason?: string;
  biomarkers: Biomarker[];
  doctorQuestions: DoctorQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  referencedBiomarkers?: string[];
}

