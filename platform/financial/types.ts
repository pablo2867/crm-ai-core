export type FinancialDataSource =
  | "manual"
  | "crm"
  | "import"
  | "integration";

export type FinancialDataSourceType =
  | "internal"
  | "financial_report"
  | "corporate_presentation"
  | "earnings_release"
  | "earnings_call"
  | "industry"
  | "competitor"
  | "external_estimate";

export type FinancialDataClassification =
  | "actual"
  | "forecast"
  | "assumption"
  | "scenario"
  | "external";

export type FinancialRecordType =
  | "revenue"
  | "expense"
  | "asset"
  | "liability"
  | "equity";

export interface FinancialPeriod {
  id?: string;
  organizationId: string;
  workspaceId: string;
  startDate: string;
  endDate: string;
  fiscalYear: number;
  fiscalPeriod: number;
  source: FinancialDataSource;
  sourceType?: FinancialDataSourceType;
  classification?: FinancialDataClassification;
}

export interface FinancialDataSourceRecord {
  id?: string;
  organizationId: string;
  workspaceId: string;
  type: FinancialDataSourceType;
  name: string;
  publisher?: string;
  reference?: string;
  publishedAt?: string;
  periodId?: string;
  currency?: string;
  classification: FinancialDataClassification;
  source: FinancialDataSource;
}

export interface FinancialAccount {
  id?: string;
  organizationId: string;
  workspaceId: string;
  code: string;
  name: string;
  type: FinancialRecordType;
  currency: string;
  active: boolean;
  source: FinancialDataSource;
  sourceType?: FinancialDataSourceType;
  classification?: FinancialDataClassification;
}

export interface FinancialTransaction {
  id?: string;
  organizationId: string;
  workspaceId: string;
  accountId: string;
  periodId?: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: FinancialRecordType;
  source: FinancialDataSource;
  sourceId?: string;
  sourceType?: FinancialDataSourceType;
  classification?: FinancialDataClassification;
}

export interface FinancialStatement {
  id?: string;
  organizationId: string;
  workspaceId: string;
  periodId: string;
  type:
    | "income_statement"
    | "balance_sheet"
    | "cash_flow";
  currency: string;
  source: FinancialDataSource;
  sourceType?: FinancialDataSourceType;
  classification?: FinancialDataClassification;
}

export interface FinancialDataContext {
  organizationId: string;
  workspaceId: string;
  userId?: string;
}

export interface FinancialDataRepository {
  getPeriods(
    context: FinancialDataContext
  ): Promise<FinancialPeriod[]>;

  getAccounts(
    context: FinancialDataContext
  ): Promise<FinancialAccount[]>;

  getTransactions(
    context: FinancialDataContext,
    periodId?: string
  ): Promise<FinancialTransaction[]>;

  getStatements(
    context: FinancialDataContext,
    periodId?: string
  ): Promise<FinancialStatement[]>;

  getSources(
    context: FinancialDataContext
  ): Promise<FinancialDataSourceRecord[]>;
}

export interface FinancialDataServiceContract {
  getPeriods(
    context: FinancialDataContext
  ): Promise<FinancialPeriod[]>;

  getAccounts(
    context: FinancialDataContext
  ): Promise<FinancialAccount[]>;

  getTransactions(
    context: FinancialDataContext,
    periodId?: string
  ): Promise<FinancialTransaction[]>;

  getStatements(
    context: FinancialDataContext,
    periodId?: string
  ): Promise<FinancialStatement[]>;

  getSources(
    context: FinancialDataContext
  ): Promise<FinancialDataSourceRecord[]>;
}

