import type {
  FinancialAccount,
  FinancialDataContext,
  FinancialPeriod,
  FinancialStatement,
  FinancialTransaction,
} from "../types";

export interface CRMFinancialSnapshot {
  organizationId: string;
  workspaceId: string;
  periodId?: string;
  revenue: number;
  pipelineRevenue: number;
  weightedPipelineRevenue: number;
  source: "crm";
}

export function createCRMFinancialSnapshot(
  context: FinancialDataContext,
  input: {
    revenue?: number;
    pipelineRevenue?: number;
    weightedPipelineRevenue?: number;
    periodId?: string;
  },
): CRMFinancialSnapshot {
  return {
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    periodId: input.periodId,
    revenue: input.revenue ?? 0,
    pipelineRevenue: input.pipelineRevenue ?? 0,
    weightedPipelineRevenue: input.weightedPipelineRevenue ?? 0,
    source: "crm",
  };
}



