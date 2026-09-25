import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialForecastMethod =
  | "historical_average"
  | "growth_rate"
  | "trend";

export interface FinancialForecastRequest {
  context: FinancialDataContext;
  periodId?: string;
  periods: number;
  method: FinancialForecastMethod;
  classification?: FinancialDataClassification;
}

export interface FinancialForecastPeriod {
  period: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FinancialForecastResult {
  context: FinancialDataContext;
  basePeriodId?: string;
  method: FinancialForecastMethod;
  periods: FinancialForecastPeriod[];
}