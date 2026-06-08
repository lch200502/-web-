export type ActiveTab = 
  | 'workbench' 
  | 'patients' 
  | 'followup' 
  | 'triage' 
  | 'consultation' 
  | 'prescriptions' 
  | 'statistics' 
  | 'profile';

export interface Patient {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  phone: string;
  avatarColor: string;
  chiefComplaint: string;
  diagnosis?: string;
  status: '待诊' | '接诊中' | '已结案' | '回访中';
  lastVisit: string;
  allergy: string;
  bloodType: string;
  medicalHistory: string;
  pastHistory: string;
  symptoms?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: '男' | '女';
  diagnosis: string;
  drugs: DrugItem[];
  date: string;
  status: '草稿' | '已下达' | '已作废';
  signature?: string;
}

export interface DrugItem {
  id: string;
  name: string;
  spec: string; // e.g., 100mg*30片
  dosage: string; // e.g., 100mg
  frequency: string; // e.g., 1次/日
  route: string; // e.g., 口服
  count: number; // number of boxes
}

export interface Message {
  id: string;
  sender: 'doctor' | 'patient' | 'ai';
  content: string;
  timestamp: string;
  isAiSuggested?: boolean;
}

export interface TriageStepData {
  patientName: string;
  gender: '男' | '女';
  age: number;
  phone: string;
  symptomsInput: string;
  selectedDiseases: { name: string; probability: number }[];
  neurologyMatch: number;
  medicineMatch: number;
  eyeMatch: number;
  recommendations: string[];
  precautions: string[];
}
