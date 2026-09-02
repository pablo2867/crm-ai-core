import type {
  RepairAction,
  RepairPlan,
} from "../types";

export type ApprovalStatus =
  | "approved"
  | "rejected"
  | "pending";

export interface RepairApprovalRequest {

  issueId: string;

  plan: RepairPlan;

  actions: RepairAction[];

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface RepairApprovalContext {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface RepairApprovalDecision {

  issueId: string;

  status: ApprovalStatus;

  approved: boolean;

  decidedBy?: string;

  reason: string;

  decidedAt?: string;

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface RepairApprovalGateway {

  requestApproval(
    request: RepairApprovalRequest
  ):
    Promise<RepairApprovalDecision>;

  approve(
    issueId: string,
    decidedBy: string,
    reason?: string,
    context?: {
      userId?: string;
      organizationId?: string;
      workspaceId?: string;
    }
  ):
    Promise<RepairApprovalDecision>;

  reject(
    issueId: string,
    decidedBy: string,
    reason: string,
    context?: {
      userId?: string;
      organizationId?: string;
      workspaceId?: string;
    }
  ):
    Promise<RepairApprovalDecision>;

  getDecision(
    issueId: string,
    context?: {
      userId?: string;
      organizationId?: string;
      workspaceId?: string;
    }
  ):
    Promise<
      RepairApprovalDecision |
      undefined
    >;

}


