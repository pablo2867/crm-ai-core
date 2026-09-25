import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FinancialRiskCategory =
  | "liquidity"
  | "solvency"
  | "profitability"
  | "operating"
  | "data_quality";

export interface FinancialRiskRequest {
  context: FinancialDataContext;
  periodId?: string;
  classification?: FinancialDataClassification;
}

export interface FinancialRiskFactor {
  category: FinancialRiskCategory;
  metric: string;
  value: number | null;
  contribution: number;
  level: FinancialRiskLevel;
  message: string;
  evidence: string[];
}

export interface FinancialRiskAlert {
  category: FinancialRiskCategory;
  severity: FinancialRiskLevel;
  title: string;
  message: string;
  evidence: string[];
}

export interface FinancialRiskResult {
  context: FinancialDataContext;
  periodId?: string;
  riskScore: number;
  riskLevel: FinancialRiskLevel;
  factors: FinancialRiskFactor[];
  alerts: FinancialRiskAlert[];
  debtRatio: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
  grossMargin: number | null;
  operatingMargin: number | null;
  netMargin: number | null;
  dataCompleteness: number | null;
  warnings: string[];
}
