import {
  contextEngine,
} from "@/platform/context";

import type {
  AIContext,
  AIContextLead,
} from "./types";

export class AIContextBuilder {

  async build(
    userId: string,
    organizationId?: string,
    workspaceId?: string
  ): Promise<AIContext> {

    const crmContext =
      await contextEngine.build(
        userId,
        organizationId,
        workspaceId
      );

    /*
    ---------------------------------------
    LEADS PRIORIZADOS
    ---------------------------------------

    El AI Context conserva los 5 leads
    más relevantes para consumo de IA.
    ---------------------------------------
    */

    const leads: AIContextLead[] =

      [...crmContext.leads]

        .sort(

          (a, b) =>

            (b.ai_score ?? 0) -

            (a.ai_score ?? 0)

        )

        .slice(0, 5)

        .map(

          lead => ({

            id:
              lead.id,

            name:
              lead.name,

            score:
              lead.ai_score ?? 0,

            probability:
              lead.close_probability ?? 0,

            revenue:
              Number(
                lead.estimated_revenue ?? 0
              ),

            temperature:
              lead.ai_temperature ?? "COLD",

          })

        );

    /*
    ---------------------------------------
    TOTAL REVENUE
    ---------------------------------------

    Revenue total del CRM.

    No debe calcularse únicamente sobre
    los 5 leads mostrados al AI.
    ---------------------------------------
    */

    const totalRevenue =

      crmContext.leads.reduce(

        (total, lead) =>

          total +
          Number(
            lead.estimated_revenue ?? 0
          ),

        0

      );

    /*
    ---------------------------------------
    BEST LEAD
    ---------------------------------------

    Se calcula sobre todo el CRM,
    no solamente sobre los 5 leads
    seleccionados para presentación.
    ---------------------------------------
    */

    const bestLeadRecord =

      [...crmContext.leads]

        .sort(

          (a, b) =>

            (
              (b.ai_score ?? 0) +
              (b.close_probability ?? 0)
            ) -

            (
              (a.ai_score ?? 0) +
              (a.close_probability ?? 0)
            )

        )[0];

    const bestLead: AIContextLead | undefined =

      bestLeadRecord

        ? {

            id:
              bestLeadRecord.id,

            name:
              bestLeadRecord.name,

            score:
              bestLeadRecord.ai_score ?? 0,

            probability:
              bestLeadRecord.close_probability ?? 0,

            revenue:
              Number(
                bestLeadRecord.estimated_revenue ?? 0
              ),

            temperature:
              bestLeadRecord.ai_temperature ?? "COLD",

          }

        : undefined;

    /*
    ---------------------------------------
    HOT LEADS
    ---------------------------------------

    Se cuentan sobre todo el CRM.
    ---------------------------------------
    */

    const hotLeads =

      crmContext.leads.filter(

        lead =>

          lead.ai_temperature ===
          "HOT"

      ).length;

    return {

      leads,

      bestLead,

      totalRevenue,

      hotLeads,

    };

  }

}

export const aiContextBuilder =
  new AIContextBuilder();


