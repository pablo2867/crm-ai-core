import type {
  FinancialDataClassification,
  FinancialDataContext,
  FinancialTransaction,
} from "../types";

export type FinancialAnalysisType =
  | "revenue"
  | "expenses"
  | "profitability"
  | "cash_flow"
  | "trends"
  | "variance"
  | "financial_statements"
  | "full";

export type FinancialFindingType =
  | "positive"
  | "negative"
  | "warning"
  | "neutral";

export type FinancialRecommendationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type FinancialChartType =
  | "line"
  | "bar"
  | "area"
  | "pie";

export interface FinancialAnalysisRequest {
  context: FinancialDataContext;
  analysisType: FinancialAnalysisType;
  periodId?: string;
  comparePeriodId?: string;
  classification?: FinancialDataClassification;

  costAccountCodes?: string[];
  costAccountKeywords?: string[];

  includeStatements?: boolean;
  includeCharts?: boolean;
  includeRecommendations?: boolean;
}

export interface FinancialAnalysisMetric {
  name: string;
  value: number;
  unit: "currency" | "percentage" | "number";
  currency?: string;
  label?: string;
}

export interface FinancialAnalysisTrend {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  direction: "up" | "down" | "stable";
}

export interface FinancialAnalysisVariance {
  metric: string;
  actual: number;
  reference: number;
  variance: number;
  variancePercentage: number;
  direction: "above" | "below" | "equal";
}

export interface FinancialAnalysisFinding {
  type: FinancialFindingType;
  metric: string;
  message: string;
  evidence?: string[];
  severity?: "low" | "medium" | "high" | "critical";
}

export interface FinancialStatementLine {
  key: string;
  label: string;
  amount: number;
  currency?: string;
  percentageOfBase?: number;
  sourceType?: FinancialTransaction["type"];
}

export interface FinancialStatement {
  type:
    | "income_statement"
    | "balance_sheet"
    | "cash_flow";
  currency?: string;
  periodId?: string;
  title: string;
  available: boolean;
  completeness: number;
  lines: FinancialStatementLine[];
  totals: Record<string, number>;
  warnings: string[];
}

export interface FinancialChartSeries {
  key: string;
  label: string;
  values: number[];
  unit: "currency" | "percentage" | "number";
}

export interface FinancialChart {
  id: string;
  title: string;
  type: FinancialChartType;
  labels: string[];
  series: FinancialChartSeries[];
}

export interface FinancialChartData {
  charts: FinancialChart[];
}

export interface FinancialRecommendation {
  id: string;
  priority: FinancialRecommendationPriority;
  area:
    | "revenue"
    | "costs"
    | "expenses"
    | "profitability"
    | "liquidity"
    | "solvency"
    | "cash_flow"
    | "data_quality";
  problem: string;
  evidence: string[];
  action: string;
  expectedImpact?: string;
  confidence: number;
}

export interface FinancialDataQuality {
  transactionCount: number;
  currencies: string[];
  missingAccountReferences: number;
  invalidAmounts: number;
  missingDates: number;
  duplicateTransactionIds: number;
  unclassifiedTransactions: number;

  balanceSheetAvailable: boolean;
  incomeStatementAvailable: boolean;
  cashFlowAvailable: boolean;

  completeness: number;
  warnings: string[];
}

export interface FinancialStatementAnalysis {
  incomeStatement: FinancialStatement;
  balanceSheet: FinancialStatement;
  cashFlow: FinancialStatement;
}

export interface FinancialAnalysisResult {
  analysisType: FinancialAnalysisType;
  context: FinancialDataContext;
  periodId?: string;
  currency?: string;

  metrics: FinancialAnalysisMetric[];
  trends: FinancialAnalysisTrend[];
  variances: FinancialAnalysisVariance[];
  findings: FinancialAnalysisFinding[];

  statements?: FinancialStatementAnalysis;
  charts?: FinancialChart[];
  recommendations?: FinancialRecommendation[];
  dataQuality?: FinancialDataQuality;

  summary: {
    revenue: number;
    costOfSales: number;
    grossProfit: number;
    operatingExpenses: number;
    operatingProfit: number;
    otherIncome: number;
    otherExpenses: number;
    netProfit: number;

    assets: number;
    liabilities: number;
    equity: number;
    cashFlow: number;

    grossMargin: number | null;
    operatingMargin: number | null;
    netMargin: number | null;

    balanceCheckDifference: number | null;
  };
}
