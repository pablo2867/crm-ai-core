import {
  repairPolicy,
} from "./repair-policy";

import {
  repairAdapterRegistry,
} from "./repair-adapters/registry";

import {
  repairApprovalGateway,
} from "./approval/gateway";

import type {
  DiagnosticIssue,
  RepairAction,
  RepairPlan,
} from "./types";

import type {
  RepairAdapterContext,
} from "./repair-adapters/types";

export type RepairExecutionStatus =
  | "executed"
  | "requires-approval"
  | "denied"
  | "skipped";

export interface RepairExecutionResult {

  issueId: string;

  status: RepairExecutionStatus;

  success: boolean;

  message: string;

  actions: RepairAction[];

  executedActions: string[];

  skippedActions: string[];

  adapterMetadata?: Record<
    string,
    unknown
  >;

  approval?: {

    status:
      | "approved"
      | "rejected"
      | "pending";

    approved: boolean;

    reason: string;

    decidedBy?: string;

    decidedAt?: string;

  };

}

export interface RepairExecutionContext {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  requestedBy?: string;

}

export class RepairExecutor {

  async execute(
    issue: DiagnosticIssue,
    plan: RepairPlan,
    context: RepairExecutionContext = {}
  ): Promise<RepairExecutionResult> {

    const policy =
      repairPolicy.evaluate(
        issue,
        plan
      );

    if (
      policy.decision === "deny"
    ) {

      return {

        issueId:
          issue.id,

        status:
          "denied",

        success:
          false,

        message:
          policy.reason,

        actions:
          plan.actions,

        executedActions: [],

        skippedActions:
          plan.actions.map(
            action =>
              action.id
          ),

      };

    }

    if (
      plan.actions.length === 0
    ) {

      return {

        issueId:
          issue.id,

        status:
          "skipped",

        success:
          false,

        message:
          "No existen acciones de reparación para ejecutar.",

        actions: [],

        executedActions: [],

        skippedActions: [],

      };

    }

    /*
    ---------------------------------------
    APPROVAL
    ---------------------------------------
    */

    if (
      policy.decision ===
      "require-approval"
    ) {

      const approval =
        await repairApprovalGateway
          .requestApproval({

            issueId:
              issue.id,

            plan,

            actions:
              plan.actions,

            userId:
              context.userId,

            organizationId:
              context.organizationId,

            workspaceId:
              context.workspaceId,

          });

      /*
      ---------------------------------------
      Approved
      ---------------------------------------
      */

      if (
        !approval.approved
      ) {

        return {

          issueId:
            issue.id,

          status:
            approval.status ===
              "rejected"
              ? "denied"
              : "requires-approval",

          success:
            false,

          message:
            approval.reason,

          actions:
            plan.actions,

          executedActions: [],

          skippedActions:
            plan.actions.map(
              action =>
                action.id
            ),

          approval: {

            status:
              approval.status,

            approved:
              approval.approved,

            reason:
              approval.reason,

            decidedBy:
              approval.decidedBy,

            decidedAt:
              approval.decidedAt,

          },

        };

      }

    }

    /*
    ---------------------------------------
    ADAPTER EXECUTION
    ---------------------------------------
    */

    const executedActions:
      string[] = [];

    const skippedActions:
      string[] = [];

    const messages:
      string[] = [];

    let overallSuccess =
      true;

    let adapterMetadata:
      Record<string, unknown> |
      undefined;

    for (
      const action of plan.actions
    ) {

      const adapter =
        repairAdapterRegistry.get(
          action.type
        );

      if (!adapter) {

        overallSuccess =
          false;

        skippedActions.push(
          action.id
        );

        messages.push(
          `No existe Repair Adapter para el tipo '${action.type}'.`
        );

        continue;

      }

      if (
        !adapter.canHandle(
          action
        )
      ) {

        overallSuccess =
          false;

        skippedActions.push(
          action.id
        );

        messages.push(
          `El Repair Adapter '${action.type}' no puede manejar la acción '${action.id}'.`
        );

        continue;

      }

      try {

        const adapterContext:
          RepairAdapterContext = {

          issueId:
            issue.id,

          action,

          userId:
            context.userId,

          organizationId:
            context.organizationId,

          workspaceId:
            context.workspaceId,

        };

        const adapterResult =
          await adapter.execute(
            adapterContext
          );

        if (
          adapterResult.success
        ) {

          executedActions.push(
            action.id
          );

        } else {

          overallSuccess =
            false;

          skippedActions.push(
            action.id
          );

        }

        messages.push(
          adapterResult.message
        );

        if (
          adapterResult.metadata
        ) {

          adapterMetadata = {

            ...adapterMetadata,

            ...adapterResult.metadata,

          };

        }

      } catch (error) {

        overallSuccess =
          false;

        skippedActions.push(
          action.id
        );

        messages.push(
          error instanceof Error
            ? error.message
            : "Error ejecutando Repair Adapter."
        );

      }

    }

    const approval =
      policy.decision ===
      "require-approval"
        ? await repairApprovalGateway.getDecision(
            issue.id,
            {

              userId:
                context.userId,

              organizationId:
                context.organizationId,

              workspaceId:
                context.workspaceId,

            }
          )
        : undefined;

    return {

      issueId:
        issue.id,

      status:
        overallSuccess
          ? "executed"
          : "skipped",

      success:
        overallSuccess,

      message:
        messages.join(" "),

      actions:
        plan.actions,

      executedActions,

      skippedActions,

      adapterMetadata,

      approval: approval
        ? {

            status:
              approval.status,

            approved:
              approval.approved,

            reason:
              approval.reason,

            decidedBy:
              approval.decidedBy,

            decidedAt:
              approval.decidedAt,

          }
        : undefined,

    };

  }

  async executeAll(
    items: Array<{
      issue: DiagnosticIssue;
      plan: RepairPlan;
    }>,
    context: RepairExecutionContext = {}
  ): Promise<RepairExecutionResult[]> {

    const results:
      RepairExecutionResult[] = [];

    for (
      const item of items
    ) {

      results.push(
        await this.execute(
          item.issue,
          item.plan,
          context
        )
      );

    }

    return results;

  }

}

export const repairExecutor =
  new RepairExecutor();

