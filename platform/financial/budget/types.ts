import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialBudgetType =
  | "revenue"
  | "expense"
  | "profit";

export interface FinancialBudgetLine {
  type: FinancialBudgetType;
  amount: number;
  currency: string;
  classification?: FinancialDataClassification;
}

export interface FinancialBudgetRequest {
  context: FinancialDataContext;
  periodId?: string;
  lines: FinancialBudgetLine[];
}

export interface FinancialBudgetResult {
  context: FinancialDataContext;
  periodId?: string;
  revenue: number;
  expenses: number;
  profit: number;
  currency: string;
  lines: FinancialBudgetLine[];
}