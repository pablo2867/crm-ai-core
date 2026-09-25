import type { FinancialDataContext } from "../types";
import type { FinancialRiskResult } from "../risk";

export type FinancialExecutiveReportType =
  | "financial_summary"
  | "performance"
  | "forecast"
  | "risk"
  | "investment";

export interface FinancialExecutiveReportRequest {
  context: FinancialDataContext;
  periodId?: string;
  type: FinancialExecutiveReportType;
}

export interface FinancialExecutiveReportMetric {
  name: string;
  value: number;
  unit: "currency" | "percentage" | "number";
  currency?: string;
}

export interface FinancialExecutiveReportFinding {
  type: "positive" | "negative" | "warning" | "neutral";
  title: string;
  message: string;
  evidence?: string[];
  severity?: "low" | "medium" | "high" | "critical";
}

export interface FinancialExecutiveReportResult {
  context: FinancialDataContext;
  periodId?: string;
  type: FinancialExecutiveReportType;
  title: string;
  summary: string;
  metrics: FinancialExecutiveReportMetric[];
  findings: FinancialExecutiveReportFinding[];
  risk?: FinancialRiskResult;
}
