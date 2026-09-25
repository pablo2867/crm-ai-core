import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialValuationMethod =
  | "dcf"
  | "revenue_multiple"
  | "ebitda_multiple";

export interface FinancialValuationRequest {
  context: FinancialDataContext;
  periodId?: string;
  classification?: FinancialDataClassification;
  method: FinancialValuationMethod;

  revenue?: number;
  ebitda?: number;

  cashFlows?: number[];
  discountRate?: number;
  terminalGrowthRate?: number;

  revenueMultiple?: number;
  ebitdaMultiple?: number;
}

export interface FinancialValuationResult {
  context: FinancialDataContext;
  periodId?: string;
  method: FinancialValuationMethod;

  enterpriseValue: number;
  equityValue: number | null;

  assumptions: {
    discountRate?: number;
    terminalGrowthRate?: number;
    revenueMultiple?: number;
    ebitdaMultiple?: number;
  };

  warnings: string[];
}
