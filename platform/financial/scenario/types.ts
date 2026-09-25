import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialScenarioType =
  | "base"
  | "optimistic"
  | "pessimistic"
  | "custom";

export type FinancialScenarioMetric =
  | "revenue"
  | "expenses";

export interface FinancialScenarioAdjustment {
  metric: FinancialScenarioMetric;
  percentage: number;
}

export interface FinancialScenarioRequest {
  context: FinancialDataContext;
  periodId?: string;
  type: FinancialScenarioType;
  adjustments: FinancialScenarioAdjustment[];
  classification?: FinancialDataClassification;
}

export interface FinancialScenarioResult {
  context: FinancialDataContext;
  periodId?: string;
  type: FinancialScenarioType;
  baseRevenue: number;
  baseExpenses: number;
  scenarioRevenue: number;
  scenarioExpenses: number;
  baseProfit: number;
  scenarioProfit: number;
  revenueChange: number;
  expenseChange: number;
  profitChange: number;
  adjustments: FinancialScenarioAdjustment[];
  warnings: string[];
}
