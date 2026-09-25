import type {
  FinancialDataClassification,
  FinancialDataContext,
} from "../types";

export type FinancialRatioCategory =
  | "liquidity"
  | "leverage"
  | "profitability"
  | "operating";

export type FinancialRatioType =
  | "current_ratio"
  | "quick_ratio"
  | "debt_ratio"
  | "debt_to_equity"
  | "gross_margin"
  | "operating_margin"
  | "net_margin"
  | "roa"
  | "roe"
  | "asset_turnover";

export interface FinancialRatioRequest {
  context: FinancialDataContext;
  periodId?: string;
  ratioTypes?: FinancialRatioType[];
  classification?: FinancialDataClassification;
  currentAssetAccountCodes?: string[];
  currentAssetAccountKeywords?: string[];
  liquidAssetAccountCodes?: string[];
  liquidAssetAccountKeywords?: string[];
  inventoryAccountCodes?: string[];
  inventoryAccountKeywords?: string[];
  currentLiabilityAccountCodes?: string[];
  currentLiabilityAccountKeywords?: string[];
  costAccountCodes?: string[];
  costAccountKeywords?: string[];
  operatingExpenseAccountCodes?: string[];
  operatingExpenseAccountKeywords?: string[];
}

export interface FinancialRatioResult {
  type: FinancialRatioType;
  category: FinancialRatioCategory;
  value: number | null;
  unit: "ratio" | "percentage";
}

export interface FinancialRatiosResult {
  context: FinancialDataContext;
  periodId?: string;
  ratios: FinancialRatioResult[];
}
