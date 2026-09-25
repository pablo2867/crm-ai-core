import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialInvestmentMetric =
  | "roi"
  | "npv"
  | "payback_period";

export interface FinancialInvestmentRequest {
  context: FinancialDataContext;
  periodId?: string;
  classification?: FinancialDataClassification;
  initialInvestment: number;
  cashFlows: number[];
  discountRate?: number;
}

export interface FinancialInvestmentResult {
  context: FinancialDataContext;
  periodId?: string;
  initialInvestment: number;
  totalCashFlow: number;
  roi: number;
  npv: number;
  paybackPeriod: number | null;
  warnings: string[];
}
