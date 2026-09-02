import type {
  RepairApprovalDecision,
  RepairApprovalRequest,
} from "./types";

export interface ApprovalRepository {

  create(
    request: RepairApprovalRequest
  ):
    Promise<RepairApprovalDecision>;

  get(
    issueId: string,
    context: {
      userId?: string;
      organizationId?: string;
      workspaceId?: string;
    }
  ):
    Promise<RepairApprovalDecision | undefined>;

  update(
    decision: RepairApprovalDecision
  ):
    Promise<RepairApprovalDecision>;

}
