import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  aiGateway,
} from "@/platform/ai/gateway";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    console.log(
      "EXECUTIVE USER:",
      user?.id
    );

    if (!user) {

      return NextResponse.json({

        success: false,

        error:
          "USER_NOT_FOUND",

      });

    }

    const {
      data: leads,
      error: leadsError,
    } =
      await supabaseAdmin

        .from("leads")

        .select(`
          name,
          status,
          ai_score,
          ai_temperature,
          estimated_revenue,
          close_probability
        `)

        .eq(
          "user_id",
          user.id
        );

    console.log(
      "EXECUTIVE LEADS:",
      leads?.length || 0
    );

    if (leadsError) {

      console.error(
        "EXECUTIVE LEADS ERROR:",
        leadsError
      );

      return NextResponse.json({

        success: false,

        error:
          leadsError.message,

      });

    }

    if (
      !leads ||
      leads.length === 0
    ) {

      return NextResponse.json({

        success: true,

        brief:
          "No existen leads para analizar.",

      });

    }

    const context =
      leads

        .map(
          (lead) => `
Lead: ${lead.name}
Status: ${lead.status}
Score: ${lead.ai_score || 0}
Temp: ${lead.ai_temperature || "N/A"}
Prob: ${lead.close_probability || 0}
Revenue: ${lead.estimated_revenue || 0}
`
        )

        .join("\n");

    const prompt = `
Eres un Director Comercial Senior.

Analiza los leads y responde EXACTAMENTE:

LEAD_PRIORITARIO:
[lead]

RIESGO:
[riesgo]

REVENUE:
[monto estimado]

ACCION:
[acciÃ³n recomendada]

Reglas:

- EspaÃ±ol.
- MÃ¡ximo 80 palabras.
- Sin markdown.
- Sin listas.

${context}
`;

    const response =
      await aiGateway.generate({

        prompt,

        temperature: 0,

        numPredict: 80,

      });

    if (!response.success) {

      return NextResponse.json({

        success: false,

        error:
          "AI_GATEWAY_ERROR",

        brief:
          "No fue posible generar el resumen ejecutivo.",

        provider:
          response.provider,

        model:
          response.model,

      });

    }

    console.log(
      "EXECUTIVE BRIEF GENERATED"
    );

    return NextResponse.json({

      success: true,

      brief:
        response.text,

      provider:
        response.provider,

      model:
        response.model,

    });

  } catch (error: unknown) {

    console.error(
      "EXECUTIVE BRIEF ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

      error:
        (error instanceof Error ? error.message : undefined) ??
        "UNKNOWN_ERROR",

      brief:
        "Error generando resumen ejecutivo.",

    });

  }

}

