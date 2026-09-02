import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  aiGateway,
} from "@/platform/ai/gateway";

const supabase =
  createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(
  request: Request
) {

  try {

    const authHeader =
      request.headers.get(
        "authorization"
      );

    if (!authHeader) {

      return NextResponse.json({

        success: false,

        result:
          "Unauthorized",

      });

    }

    const token =
      authHeader.replace(
        "Bearer ",
        ""
      );

    const {
      data: { user },
    } =
      await supabase.auth.getUser(
        token
      );

    if (!user) {

      return NextResponse.json({

        success: false,

        result:
          "Unauthorized",

      });

    }

    const body =
      await request.json();

    const prompt = `
Analiza este lead CRM.

Nombre:
${body.name}

Empresa:
${body.company}

Email:
${body.email}

IMPORTANTE:

NO uses markdown.
NO uses **.
NO uses listas.

Responde EXACTAMENTE asÃ­:

Temperatura: HOT/WARM/COLD
Score: 1-100
Probabilidad: Alta/Media/Baja
Prioridad: Alta/Media/Baja
IntenciÃ³n: Compra/InvestigaciÃ³n/Contacto
Resumen: una sola lÃ­nea corta
`;

    const response =
      await aiGateway.generate({

        prompt,

        temperature: 0.1,

        numPredict: 60,

      });

    if (!response.success) {

      return NextResponse.json({

        success: false,

        result:
          "No fue posible analizar el lead.",

        provider:
          response.provider,

        model:
          response.model,

      });

    }

    const result =
      response.text;

    if (
      process.env.NODE_ENV ===
      "development"
    ) {

      console.log(
        "ANALYZE LEAD OK"
      );

    }

    const scoreMatch =
      result.match(
        /Score:\s*(\d+)/i
      );

    const probabilityMatch =
      result.match(
        /Probabilidad:\s*(.*)/i
      );

    const priorityMatch =
      result.match(
        /Prioridad:\s*(.*)/i
      );

    const summaryMatch =
      result.match(
        /Resumen:\s*(.*)/i
      );

    const ai_score =
      scoreMatch
        ? parseInt(
            scoreMatch[1]
          )
        : 0;

    let ai_temperature =
      "COLD";

    if (ai_score >= 85) {

      ai_temperature =
        "HOT";

    } else if (
      ai_score >= 70
    ) {

      ai_temperature =
        "WARM";

    }

    const ai_probability =
      probabilityMatch?.[1]
        ?.trim() ??
      "Media";

    const ai_priority =
      priorityMatch?.[1]
        ?.trim() ??
      "Media";

    const ai_analysis =
      summaryMatch?.[1]
        ?.trim() ??
      "Sin anÃ¡lisis";

    const cleanEmail =
      body.email
        ?.trim()
        ?.toLowerCase();

    const {
      error,
    } =
      await supabase

        .from("leads")

        .update({

          ai_score,

          ai_analysis,

          ai_temperature,

          ai_probability,

          ai_priority,

        })

        .eq(
          "email",
          cleanEmail
        )

        .eq(
          "user_id",
          user.id
        );

    if (error) {

      console.error(
        "SUPABASE ERROR:",
        error
      );

      return NextResponse.json({

        success: false,

        result:
          "Error actualizando lead",

      });

    }

    return NextResponse.json({

      success: true,

      result,

      provider:
        response.provider,

      model:
        response.model,

    });

  } catch (error) {

    console.error(
      "ANALYZE LEAD ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

      result:
        "Error analizando lead",

    });

  }

}


