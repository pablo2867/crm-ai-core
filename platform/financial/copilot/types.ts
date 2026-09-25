import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialCopilotIntent =
  | "analysis"
  | "ratios"
  | "forecast"
  | "budget"
  | "scenario"
  | "sensitivity"
  | "investment"
  | "risk"
  | "valuation"
  | "report";

export interface FinancialCopilotRequest {
  context: FinancialDataContext;
  message: string;
  intent?: FinancialCopilotIntent;
  periodId?: string;
  classification?: FinancialDataClassification;
}

export interface FinancialCopilotRecommendation {
  priority: "low" | "medium" | "high";
  title: string;
  message: string;
}

export interface FinancialCopilotResult {
  context: FinancialDataContext;
  message: string;
  intent: FinancialCopilotIntent;
  confidence: number;

  data: Record<string, unknown>;

  explanation: string;

  recommendations: FinancialCopilotRecommendation[];
}