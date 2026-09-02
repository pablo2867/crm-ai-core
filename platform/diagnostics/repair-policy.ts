import type {
  DiagnosticIssue,
  RepairPlan,
} from "./types";

export type RepairDecision =
  | "allow"
  | "require-approval"
  | "deny";

export interface RepairPolicyResult {

  decision: RepairDecision;

  allowed: boolean;

  requiresApproval: boolean;

  reason: string;

}

export class RepairPolicy {

  evaluate(
    issue: DiagnosticIssue,
    plan: RepairPlan
  ): RepairPolicyResult {

    if (
      issue.risk === "critical"
    ) {

      return {

        decision:
          "deny",

        allowed:
          false,

        requiresApproval:
          false,

        reason:
          "Las reparaciones críticas nunca se ejecutan automáticamente.",

      };

    }

    if (
      issue.category === "tenant" ||
      issue.category === "database"
    ) {

      return {

        decision:
          "require-approval",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          "Las modificaciones sobre tenant o base de datos requieren aprobación explícita.",

      };

    }

    if (
      issue.category === "architecture"
    ) {

      return {

        decision:
          "require-approval",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          "Los cambios arquitectónicos requieren revisión.",

      };

    }

    if (
      issue.risk === "high" ||
      issue.risk === "medium"
    ) {

      return {

        decision:
          "require-approval",

        allowed:
          false,

        requiresApproval:
          true,

        reason:
          "La reparación supera el nivel permitido para ejecución automática.",

      };

    }

    if (
      !issue.repairable ||
      plan.actions.length === 0
    ) {

      return {

        decision:
          "deny",

        allowed:
          false,

        requiresApproval:
          false,

        reason:
          "El issue no tiene una reparación ejecutable definida.",

      };

    }

    return {

      decision:
        "allow",

      allowed:
        true,

      requiresApproval:
        false,

      reason:
        "La reparación es de bajo riesgo y puede ejecutarse automáticamente.",

    };

  }

}

export const repairPolicy =
  new RepairPolicy();
