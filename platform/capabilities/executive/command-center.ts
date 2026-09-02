import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";

import {
  getLeadDashboard,
} from "@/platform/services/lead-service";

export const commandCenterCapability: Capability = {

  id: "command-center",

  name: "AI Command Center",

  async execute(
    request: CapabilityRequest
  ): Promise<CapabilityResult> {

    if (!request.userId) {

      return {

        success: false,

        message:
          "No se recibió el usuario.",

      };

    }

    /*
    ---------------------------------------
    RUNTIME CONTEXT
    ---------------------------------------

    WorkflowExecutor propaga el WorkflowContext
    mediante request.input.

    AIKernel ya construyó el contexto CRM antes
    de ejecutar el workflow.

    Evitamos consultar Supabase nuevamente
    cuando ese contexto ya está disponible.
    */

    const input =
      request.input ?? {};

    const runtimeContext =
      input.context;

    const crmContext =
      runtimeContext &&
      typeof runtimeContext === "object"
        ? runtimeContext as Record<string, unknown>
        : undefined;

    const contextLeads =
      crmContext?.leads;

    const hasContextLeads =
      Array.isArray(contextLeads);

    /*
    ---------------------------------------
    Dashboard Data
    ---------------------------------------

    Preferimos el contexto existente.

    Fallback:
    si la capability se ejecuta fuera del
    Runtime/Kernels con contexto incompleto,
    conserva el comportamiento anterior.
    */

    let dashboard;

    if (hasContextLeads) {

      const leads =
        contextLeads as Array<
          Record<string, unknown>
        >;

      const bestLead =
        crmContext?.bestLead &&
        typeof crmContext.bestLead === "object"
          ? crmContext.bestLead
          : leads.length
            ? [...leads].sort(
                (a, b) =>
                  Number(b.ai_score ?? 0) -
                  Number(a.ai_score ?? 0)
              )[0]
            : null;

      const hotLeads =
        leads
          .filter(
            lead =>
              Number(lead.ai_score ?? 0) >= 80
          )
          .sort(
            (a, b) =>
              Number(b.ai_score ?? 0) -
              Number(a.ai_score ?? 0)
          );

      const closingCandidates =
        leads
          .filter(
            lead =>
              Number(
                lead.close_probability ?? 0
              ) >= 70
          )
          .sort(
            (a, b) =>
              Number(
                b.close_probability ?? 0
              ) -
              Number(
                a.close_probability ?? 0
              )
          );

      const riskLeads =
        leads
          .filter(
            lead =>
              Number(
                lead.close_probability ?? 0
              ) < 40
          )
          .sort(
            (a, b) =>
              Number(
                a.close_probability ?? 0
              ) -
              Number(
                b.close_probability ?? 0
              )
          );

      const withoutFollowup =
        leads.filter(
          lead =>
            !lead.ai_followup ||
            String(
              lead.ai_followup
            ).trim() === ""
        );

      dashboard = {

        bestLead,

        hotLeads,

        closingCandidates,

        riskLeads,

        withoutFollowup,

        totals: {

          totalLeads:
            leads.length,

          hotLeads:
            hotLeads.length,

          closingCandidates:
            closingCandidates.length,

          riskLeads:
            riskLeads.length,

          withoutFollowup:
            withoutFollowup.length,

        },

      };

    } else {

      /*
      ---------------------------------------
      Compatibility Fallback
      ---------------------------------------
      */

      dashboard =
        await getLeadDashboard(
          request.userId
        );

    }

    const healthScore =
      Math.min(
        100,
        50 +
        dashboard.totals.hotLeads * 10 +
        dashboard.totals.closingCandidates * 5 -
        dashboard.totals.riskLeads * 5
      );

    return {

      success: true,

      message:
        "Executive Brief generado correctamente.",

      data: {

        generatedAt:
          new Date().toISOString(),

        userId:
          request.userId,

        health: {

          score:
            healthScore,

        },

        bestLead:
          dashboard.bestLead,

        totals:
          dashboard.totals,

        hotLeads:
          dashboard.hotLeads,

        closingCandidates:
          dashboard.closingCandidates,

        riskLeads:
          dashboard.riskLeads,

        withoutFollowup:
          dashboard.withoutFollowup,

      },

    };

  },

};
