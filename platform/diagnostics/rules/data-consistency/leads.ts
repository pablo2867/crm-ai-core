import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  DiagnosticRule,
} from "../../types";

export const leadDataConsistencyRule:
  DiagnosticRule = {

  id:
    "data-consistency.leads",

  block:
    "leads",

  category:
    "data-consistency",

  description:
    "Detecta leads con datos de tenant incompletos.",

  async check({
    request,
  }) {

    const userId =
      request.tenant?.userId;

    if (!userId) {

      return {

        id:
          "data-consistency.leads.missing-user",

        block:
          "leads",

        category:
          "data-consistency",

        severity:
          "high",

        title:
          "Usuario no disponible",

        description:
          "No existe userId para validar los leads.",

        evidence: [],

        affectedComponents: [
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
          name,
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
          "data-consistency.leads.query-error",

        block:
          "leads",

        category:
          "data-consistency",

        severity:
          "high",

        title:
          "Error consultando leads",

        description:
          error.message,

        evidence: [],

        affectedComponents: [
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
          !lead.organization_id ||
          !lead.workspace_id
      );

    if (
      invalid.length === 0
    ) {

      return null;

    }

    return {

      id:
        "data-consistency.leads.missing-tenant",

      block:
        "leads",

      category:
        "data-consistency",

      severity:
        "high",

      title:
        "Leads con tenant incompleto",

      description:
        `${invalid.length} lead(s) no tienen organization_id o workspace_id.`,

      rootCause:
        "Existen registros de leads sin identificación completa del tenant.",

      evidence:
        invalid.map(
          lead => ({

            type:
              "database",

            source:
              "leads",

            description:
              `Lead ${lead.id} carece de información tenant completa.`,

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
        "high",

    };

  },

};
