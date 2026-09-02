import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  DiagnosticRule,
} from "../../types";

export const tenantIsolationRule:
  DiagnosticRule = {

  id:
    "tenant.isolation",

  block:
    "tenant",

  category:
    "tenant",

  description:
    "Verifica que los leads del usuario pertenezcan al organization y workspace activos.",

  async check({
    request,
  }) {

    const userId =
      request.tenant?.userId;

    const organizationId =
      request.tenant?.organizationId;

    const workspaceId =
      request.tenant?.workspaceId;

    if (
      !userId ||
      !organizationId ||
      !workspaceId
    ) {

      return {

        id:
          "tenant.isolation.missing-context",

        block:
          "tenant",

        category:
          "tenant",

        severity:
          "high",

        title:
          "Contexto tenant incompleto",

        description:
          "El diagnóstico no recibió userId, organizationId y workspaceId completos.",

        rootCause:
          "Falta información suficiente para validar aislamiento tenant.",

        evidence: [],

        affectedComponents: [
          "tenant",
          "leads",
        ],

        repairable:
          false,

        risk:
          "high",

      };

    }

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("leads")
        .select(`
          id,
          user_id,
          organization_id,
          workspace_id
        `)
        .eq(
          "user_id",
          userId
        );

    if (error) {

      return {

        id:
          "tenant.isolation.query-error",

        block:
          "tenant",

        category:
          "tenant",

        severity:
          "high",

        title:
          "No fue posible validar el aislamiento tenant",

        description:
          error.message,

        evidence: [],

        affectedComponents: [
          "tenant",
          "leads",
        ],

        repairable:
          false,

        risk:
          "high",

      };

    }

    const invalid =
      (data ?? []).filter(
        lead =>
          lead.organization_id !==
            organizationId ||
          lead.workspace_id !==
            workspaceId
      );

    if (
      invalid.length === 0
    ) {

      return null;

    }

    return {

      id:
        "tenant.isolation.leads-mismatch",

      block:
        "tenant",

      category:
        "tenant",

      severity:
        "critical",

      title:
        "Leads fuera del tenant activo",

      description:
        `${invalid.length} lead(s) del usuario no coinciden con el organization/workspace activo.`,

      rootCause:
        "Los registros contienen una combinación de tenant diferente al contexto activo.",

      evidence:
        invalid.map(
          lead => ({

            type:
              "database",

            source:
              "leads",

            description:
              `Lead ${lead.id} tiene organization/workspace diferente.`,

            value:
              lead,

          })
        ),

      affectedComponents: [
        "leads",
        "organization",
        "workspace",
      ],

      repairable:
        false,

      risk:
        "critical",

    };

  },

};
