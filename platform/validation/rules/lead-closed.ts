import type {
  ValidationRule,
  ValidationRequest,
  ValidationResult,
} from "../types";

export class LeadClosedRule
  implements ValidationRule {

  id =
    "lead-closed";

  validate(
    request: ValidationRequest
  ): ValidationResult {

    // ==========================================
    // La regla solo aplica a workflows comerciales
    // que realmente operan sobre leads.
    // ==========================================

    const workflowId =
      request.workflow.id;

    const workflowCategory =
      request.workflow.metadata?.category;

    const isSalesWorkflow =
      workflowCategory === "sales" ||
      workflowId.startsWith("sales-");

    if (!isSalesWorkflow) {

      return {
        valid: true,
      };

    }

    const lead =
      request.context.lead;

    // ==========================================
    // No hay lead
    // ==========================================

    if (!lead) {

      return {
        valid: true,
      };

    }

    // ==========================================
    // Lead cerrado
    // ==========================================

    const status =
      lead.status?.toLowerCase();

    const pipelineStage =
      lead.pipeline_stage?.toLowerCase();

    if (
      status === "closed" ||
      status === "cerrado" ||
      pipelineStage === "closed_won"
    ) {

      return {

        valid: false,

        rule:
          this.id,

        severity:
          "HIGH",

        reason:
          "El lead ya está cerrado y no puede ejecutar nuevos workflows.",

      };

    }

    // ==========================================
    // Todo correcto
    // ==========================================

    return {

      valid: true,

    };

  }

}
