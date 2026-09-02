import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  aiGateway,
} from "@/platform/ai/gateway";

import {
  aiSalesManagerService,
} from "@/platform/services/ai-sales-manager";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json({

        success: false,

        analysis:
          "Usuario no autenticado.",

      });

    }

    const result =
      await aiSalesManagerService.execute(

        user.id

      );

    if (!result.success) {

      return NextResponse.json({

        success: false,

        analysis:
          result.message,

      });

    }

    /*
    ---------------------------------------
    Leads prioritarios
    ---------------------------------------
    */

    const leadsContext =
      result.priorityLeads

        .map(
          (lead) => `
Lead: ${lead.name}
Empresa: ${lead.company ?? "N/A"}
Score: ${lead.ai_score}
Temperatura: ${lead.ai_temperature ?? "N/A"}
Probabilidad: ${lead.close_probability}
Revenue: ${lead.estimated_revenue}
`
        )

        .join("\n");

    /*
    ---------------------------------------
    Pipeline
    ---------------------------------------
    */

    const pipeline =
      result.pipelineAnalysis;

    /*
    ---------------------------------------
    Estrategia
    ---------------------------------------
    */

    const strategy =
      result.strategy;

    const prompt = `
Eres el Director Comercial del CRM AI CORE.

Analiza el estado completo del pipeline.

==========

PIPELINE

Total Leads:
${pipeline.totalLeads}

HOT:
${pipeline.hotLeads}

WARM:
${pipeline.warmLeads}

COLD:
${pipeline.coldLeads}

Revenue:
${pipeline.totalRevenue}

Score Promedio:
${pipeline.averageScore.toFixed(1)}

Probabilidad Promedio:
${pipeline.averageProbability.toFixed(1)}

==========

RECOMENDACIONES DEL SISTEMA

${pipeline.recommendations.join("\n")}

==========

PRIORIDADES

${strategy.priorities.join("\n")}

==========

ACCIONES

${strategy.actions.join("\n")}

==========

RIESGOS

${strategy.warnings.join("\n")}

==========

OPORTUNIDADES

${strategy.opportunities.join("\n")}

==========

LEADS PRIORITARIOS

${leadsContext}

==========

Responde exactamente con este formato:

RESUMEN:

PRIORIDAD_HOY:

RIESGO_PRINCIPAL:

OPORTUNIDAD:

PLAN_DE_ACCION:

Reglas:

- Español.
- Máximo 120 palabras.
- Sin markdown.
- Sin listas.
- Respuesta ejecutiva.
`;

    const response =
      await aiGateway.generate({

        prompt,

        temperature: 0,

        numPredict: 150,

      });

    if (!response.success) {

      return NextResponse.json({

        success: false,

        analysis:
          "No fue posible generar el análisis comercial.",

        provider:
          response.provider,

        model:
          response.model,

      });

    }

    return NextResponse.json({

      success: true,

      analyzed:
        result.analyzed,

      priorityLeads:
        result.priorityLeads,

      pipeline:
        result.pipelineAnalysis,

      strategy:
        result.strategy,

      analysis:
        response.text,

      provider:
        response.provider,

      model:
        response.model,

    });

  } catch (error) {

    console.error(
      "AI SALES MANAGER ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

      analysis:
        "Error interno.",

    });

  }

}