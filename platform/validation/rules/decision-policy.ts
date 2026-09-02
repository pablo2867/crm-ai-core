import type {
  ValidationRule,
  ValidationRequest,
  ValidationResult,
} from "../types";

export class DecisionPolicyRule
  implements ValidationRule {

  id =
    "decision-policy";

  validate(
    request: ValidationRequest
  ): ValidationResult {

    console.log(
      "DECISION POLICY RULE INPUT:",
      JSON.stringify(
        request.context.metadata,
        null,
        2
      )
    );

    console.log(
      "=== DECISION POLICY RULE ===",
      JSON.stringify(
        request.context.metadata,
        null,
        2
      )
    );

    const policy =
      request.context.metadata
        ?.decisionPolicy;

    if (
      !policy ||
      typeof policy !== "object"
    ) {

      return {

        valid: true,

      };

    }

    const decisionPolicy =
      policy as Record<
        string,
        unknown
      >;

    const status =
      String(
        decisionPolicy.status ?? ""
      );

    const requiresReview =
      decisionPolicy.requiresReview === true;

    if (
      status === "tie" ||
      status === "review" ||
      requiresReview
    ) {

      return {

        valid: false,

        rule:
          this.id,

        severity:
          "HIGH",

        reason:
          "La Decision Policy requiere revisión antes de ejecutar el workflow.",

      };

    }

    return {

      valid: true,

    };

  }

}


