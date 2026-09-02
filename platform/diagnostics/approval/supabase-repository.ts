import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  ApprovalRepository,
} from "./repository";

import type {
  RepairApprovalDecision,
  RepairApprovalRequest,
} from "./types";

interface ApprovalContext {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

interface ApprovalRow {

  id: string;

  issue_id: string;

  user_id: string;

  organization_id: string;

  workspace_id: string;

  status:
    | "pending"
    | "approved"
    | "rejected";

  approved: boolean;

  plan: unknown;

  actions: unknown;

  decided_by: string | null;

  reason: string;

  created_at: string;

  decided_at: string | null;

}

function toDecision(
  row: ApprovalRow
): RepairApprovalDecision {

  return {

    issueId:
      row.issue_id,

    status:
      row.status,

    approved:
      row.approved,

    decidedBy:
      row.decided_by ??
      undefined,

    reason:
      row.reason,

    decidedAt:
      row.decided_at ??
      undefined,

    userId:
      row.user_id,

    organizationId:
      row.organization_id,

    workspaceId:
      row.workspace_id,

  };

}

export class SupabaseApprovalRepository
  implements ApprovalRepository {

  async create(
    request: RepairApprovalRequest
  ):
    Promise<RepairApprovalDecision> {

    if (
      !request.userId ||
      !request.organizationId ||
      !request.workspaceId
    ) {

      throw new Error(
        "REPAIR_APPROVAL_TENANT_CONTEXT_REQUIRED"
      );

    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("repair_approvals")
        .insert({

          issue_id:
            request.issueId,

          user_id:
            request.userId,

          organization_id:
            request.organizationId,

          workspace_id:
            request.workspaceId,

          status:
            "pending",

          approved:
            false,

          plan:
            request.plan,

          actions:
            request.actions,

          reason:
            "La reparación requiere aprobación explícita.",

        })
        .select("*")
        .single();

    if (
      error ||
      !data
    ) {

      throw new Error(
        error?.message ??
        "REPAIR_APPROVAL_CREATE_FAILED"
      );

    }

    return toDecision(
      data as ApprovalRow
    );

  }

  async get(
    issueId: string,
    context: ApprovalContext
  ):
    Promise<
      RepairApprovalDecision |
      undefined
    > {

    if (
      !context.userId ||
      !context.organizationId ||
      !context.workspaceId
    ) {

      return undefined;

    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("repair_approvals")
        .select("*")
        .eq(
          "issue_id",
          issueId
        )
        .eq(
          "user_id",
          context.userId
        )
        .eq(
          "organization_id",
          context.organizationId
        )
        .eq(
          "workspace_id",
          context.workspaceId
        )
        .maybeSingle();

    if (error) {

      throw error;

    }

    if (!data) {

      return undefined;

    }

    return toDecision(
      data as ApprovalRow
    );

  }

  async update(
    decision: RepairApprovalDecision
  ):
    Promise<RepairApprovalDecision> {

    if (
      !decision.userId ||
      !decision.organizationId ||
      !decision.workspaceId
    ) {

      throw new Error(
        "REPAIR_APPROVAL_TENANT_CONTEXT_REQUIRED"
      );

    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("repair_approvals")
        .update({

          status:
            decision.status,

          approved:
            decision.approved,

          decided_by:
            decision.decidedBy ??
            null,

          reason:
            decision.reason,

          decided_at:
            decision.decidedAt ??
            null,

        })
        .eq(
          "issue_id",
          decision.issueId
        )
        .eq(
          "user_id",
          decision.userId
        )
        .eq(
          "organization_id",
          decision.organizationId
        )
        .eq(
          "workspace_id",
          decision.workspaceId
        )
        .select("*")
        .single();

    if (
      error ||
      !data
    ) {

      throw new Error(
        error?.message ??
        "REPAIR_APPROVAL_UPDATE_FAILED"
      );

    }

    return toDecision(
      data as ApprovalRow
    );

  }

}

export const supabaseApprovalRepository =
  new SupabaseApprovalRepository();
