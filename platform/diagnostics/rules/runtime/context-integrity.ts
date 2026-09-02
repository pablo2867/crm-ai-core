import type {
  DiagnosticRule,
} from "../../types";

export const runtimeContextIntegrityRule:
  DiagnosticRule = {

  id:
    "runtime.context-integrity",

  block:
    "runtime",

  category:
    "runtime",

  description:
    "Verifica la integridad del contrato de contexto utilizado por el Runtime.",

  check({
    request,
  }) {

    const issues:
      string[] = [];

    /*
    ---------------------------------------
    Tenant
    ---------------------------------------
    */

    const tenant =
      request.tenant;

    if (
      !tenant
    ) {

      issues.push(
        "El diagnóstico no recibió contexto de tenant."
      );

    } else {

      if (
        typeof tenant.userId !==
        "string" ||
        !tenant.userId.trim()
      ) {

        issues.push(
          "userId inválido o ausente."
        );

      }

      if (
        typeof tenant.organizationId !==
        "string" ||
        !tenant.organizationId.trim()
      ) {

        issues.push(
          "organizationId inválido o ausente."
        );

      }

      if (
        typeof tenant.workspaceId !==
        "string" ||
        !tenant.workspaceId.trim()
      ) {

        issues.push(
          "workspaceId inválido o ausente."
        );

      }

    }

    /*
    ---------------------------------------
    Diagnostic Context
    ---------------------------------------
    */

    if (
      !request.scope
    ) {

      issues.push(
        "Diagnostic scope ausente."
      );

    }

    if (
      !request.mode
    ) {

      issues.push(
        "Diagnostic mode ausente."
      );

    }

    /*
    ---------------------------------------
    Result
    ---------------------------------------
    */

    if (
      issues.length === 0
    ) {

      return null;

    }

    return {

      id:
        "runtime.context-integrity.failed",

      block:
        "runtime",

      category:
        "runtime",

      severity:
        "high",

      title:
        "Integridad del contexto Runtime comprometida",

      description:
        issues.join(" "),

      rootCause:
        "El contexto requerido para ejecutar un diagnóstico Runtime no cumple las condiciones mínimas.",

      evidence: [

        {

          type:
            "contract",

          source:
            "platform/runtime/types.ts",

          description:
            "RuntimeRequest define identidad, tenant y contexto operacional.",

          value: {

            hasTenant:
              Boolean(
                tenant
              ),

            userIdValid:
              typeof tenant?.userId ===
                "string" &&
              Boolean(
                tenant.userId.trim()
              ),

            organizationIdValid:
              typeof tenant?.organizationId ===
                "string" &&
              Boolean(
                tenant.organizationId.trim()
              ),

            workspaceIdValid:
              typeof tenant?.workspaceId ===
                "string" &&
              Boolean(
                tenant.workspaceId.trim()
              ),

            scope:
              request.scope,

            mode:
              request.mode,

          },

        },

      ],

      affectedComponents: [

        "runtime",

        "kernel",

        "workflow",

        "skill",

      ],

      repairable:
        false,

      risk:
        "high",

    };

  },

};
