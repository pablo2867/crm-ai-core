import type {
  FinancialAccount,
  FinancialDataContext,
  FinancialDataRepository,
  FinancialDataSourceRecord,
  FinancialPeriod,
  FinancialStatement,
  FinancialTransaction,
} from "./types";
import { supabaseAdmin } from "@/lib/supabase-admin";

function mapPeriod(row: any): FinancialPeriod {
  return {
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    startDate: row.start_date,
    endDate: row.end_date,
    fiscalYear: row.fiscal_year,
    fiscalPeriod: row.fiscal_period,
    source: row.source,
    sourceType: row.source_type ?? undefined,
    classification: row.classification ?? undefined,
  };
}

function mapAccount(row: any): FinancialAccount {
  return {
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    code: row.code,
    name: row.name,
    type: row.type,
    currency: row.currency,
    active: row.active,
    source: row.source,
    sourceType: row.source_type ?? undefined,
    classification: row.classification ?? undefined,
  };
}

function mapTransaction(row: any): FinancialTransaction {
  return {
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    accountId: row.account_id,
    periodId: row.period_id ?? undefined,
    date: row.transaction_date,
    description: row.description,
    amount: Number(row.amount),
    currency: row.currency,
    type: row.type,
    source: row.source,
    sourceId: row.source_id ?? undefined,
    sourceType: row.source_type ?? undefined,
    classification: row.classification ?? undefined,
  };
}

function mapStatement(row: any): FinancialStatement {
  return {
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    periodId: row.period_id,
    type: row.type,
    currency: row.currency,
    source: row.source,
    sourceType: row.source_type ?? undefined,
    classification: row.classification ?? undefined,
  };
}

function mapSource(row: any): FinancialDataSourceRecord {
  return {
    id: row.id,
    organizationId: row.organization_id,
    workspaceId: row.workspace_id,
    type: row.type,
    name: row.name,
    publisher: row.publisher ?? undefined,
    reference: row.reference ?? undefined,
    publishedAt: row.published_at ?? undefined,
    periodId: row.period_id ?? undefined,
    currency: row.currency ?? undefined,
    classification: row.classification,
    source: row.source,
  };
}

export class FinancialRepository implements FinancialDataRepository {
  async getPeriods(context: FinancialDataContext): Promise<FinancialPeriod[]> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("financial_periods")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("workspace_id", context.workspaceId)
      .order("start_date", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapPeriod);
  }

  async getAccounts(context: FinancialDataContext): Promise<FinancialAccount[]> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("financial_accounts")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("workspace_id", context.workspaceId)
      .order("code", { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapAccount);
  }

  async getTransactions(
    context: FinancialDataContext,
    periodId?: string,
  ): Promise<FinancialTransaction[]> {
    const supabase = supabaseAdmin;

    let query = supabase
      .from("financial_transactions")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("workspace_id", context.workspaceId);

    if (periodId) {
      query = query.eq("period_id", periodId);
    }

    const { data, error } = await query.order("transaction_date", {
      ascending: false,
    });

    if (error) throw error;
    return (data ?? []).map(mapTransaction);
  }

  async getStatements(
    context: FinancialDataContext,
    periodId?: string,
  ): Promise<FinancialStatement[]> {
    const supabase = supabaseAdmin;

    let query = supabase
      .from("financial_statements")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("workspace_id", context.workspaceId);

    if (periodId) {
      query = query.eq("period_id", periodId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return (data ?? []).map(mapStatement);
  }

  async getSources(
    context: FinancialDataContext,
  ): Promise<FinancialDataSourceRecord[]> {
    const supabase = supabaseAdmin;

    const { data, error } = await supabase
      .from("financial_data_sources")
      .select("*")
      .eq("organization_id", context.organizationId)
      .eq("workspace_id", context.workspaceId)
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data ?? []).map(mapSource);
  }
}

