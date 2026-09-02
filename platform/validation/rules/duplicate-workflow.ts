import type {
  ValidationRule,
  ValidationRequest,
  ValidationResult,
} from "../types";

export class DuplicateWorkflowRule
  implements ValidationRule {

  id =
    "duplicate-workflow";

  validate(
    request: ValidationRequest
  ): ValidationResult {

    const memory =
      request.context.executiveMemory;

    if (!memory) {

      return {

        valid: true,

      };

    }

    if (

      memory.workflow ===

      request.workflow.id

    ) {

      return {

        valid: false,

        rule:
          this.id,

        severity:
          "MEDIUM",

        reason:
          "Este workflow ya fue ejecutado recientemente.",

      };

    }

    return {

      valid: true,

    };

  }

}