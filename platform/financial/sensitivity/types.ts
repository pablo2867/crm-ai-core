import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialSensitivityMetric =
  | "revenue"
  | "expenses";

export interface FinancialSensitivityVariable {
  metric: FinancialSensitivityMetric;
  values: number[];
}

export interface FinancialSensitivityRequest {
  context: FinancialDataContext;
  periodId?: string;
  classification?: FinancialDataClassification;
  variable: FinancialSensitivityVariable;
}

export interface FinancialSensitivityResultRow {
  value: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinancialSensitivityResult {
  context: FinancialDataContext;
  periodId?: string;
  variable: FinancialSensitivityVariable;
  baseRevenue: number;
  baseExpenses: number;
  baseProfit: number;
  rows: FinancialSensitivityResultRow[];
  warnings: string[];
}
