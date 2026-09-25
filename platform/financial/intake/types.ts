export type FinancialIntakeMode =
  | "owner"
  | "accountant";

export type FinancialIntakeStatus =
  | "not_started"
  | "in_progress"
  | "needs_confirmation"
  | "complete"
  | "blocked";

export type FinancialInformationStatus =
  | "sufficient"
  | "insufficient"
  | "inconsistent"
  | "unknown";

export type FinancialQuestionPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type FinancialQuestionType =
  | "text"
  | "number"
  | "currency"
  | "percentage"
  | "date"
  | "boolean"
  | "choice"
  | "multi_choice";

export interface FinancialIntakeQuestion {
  id: string;
  field: string;
  question: string;
  type: FinancialQuestionType;
  priority: FinancialQuestionPriority;
  required: boolean;
  options?: string[];
  reason?: string;
}

export interface FinancialIntakeAnswer {
  questionId: string;
  field: string;
  rawAnswer: string;
  interpretedValue?: unknown;
  confidence?: number;
  confirmed?: boolean;
}

export interface FinancialExtractedData {
  field: string;
  value: unknown;
  source: "user" | "document" | "system";
  confidence: number;
  confirmed: boolean;
}

export interface FinancialInconsistency {
  id: string;
  fields: string[];
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  requiresConfirmation: boolean;
}

export interface FinancialIntakeState {
  status: FinancialIntakeStatus;
  informationStatus: FinancialInformationStatus;
  mode: FinancialIntakeMode;

  currentQuestion?: FinancialIntakeQuestion;

  questions: FinancialIntakeQuestion[];
  answers: FinancialIntakeAnswer[];

  extractedData: FinancialExtractedData[];

  missingFields: string[];
  inconsistencies: FinancialInconsistency[];

  completionPercentage: number;
  canContinueToAnalysis: boolean;
}

export interface FinancialIntakeRequest {
  userId?: string;
  mode: FinancialIntakeMode;
  message?: string;
  state?: FinancialIntakeState;
}

export interface FinancialIntakeResponse {
  status: FinancialIntakeStatus;
  informationStatus: FinancialInformationStatus;

  nextQuestion?: FinancialIntakeQuestion;

  extractedData: FinancialExtractedData[];

  missingFields: string[];
  inconsistencies: FinancialInconsistency[];

  requiresConfirmation: boolean;
  canContinueToAnalysis: boolean;

  completionPercentage: number;
}