import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

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

    const body =
      await request.json();

    const response =
      await fetch(

        "http://127.0.0.1:11434/api/generate",

        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            model:
              "qwen2.5-coder",

            prompt:
              `
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

Responde EXACTAMENTE así:

Temperatura: HOT/WARM/COLD
Score: 1-100
Probabilidad: Alta/Media/Baja
Prioridad: Alta/Media/Baja
Intención: Compra/Investigación/Contacto
Resumen: una sola línea corta
`,

            stream: false,

          }),

        }

      );

    const data =
      await response.json();

    const result =
      (data.response || "")
        .replace(/\*\*/g, "")
        .trim();

    console.log(
      "RESULTADO IA:",
      result
    );

    const scoreMatch =
      result.match(
        /Score:\s*(\d+)/i
      );

    const tempMatch =
      result.match(
        /Temperatura:\s*(\w+)/i
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
        ? parseInt(scoreMatch[1])
        : 0;

    const ai_temperature =
      tempMatch?.[1]?.trim()
        ?.toUpperCase() ||
      "COLD";

    const ai_probability =
      probabilityMatch?.[1]?.trim() ||
      "Media";

    const ai_priority =
      priorityMatch?.[1]?.trim() ||
      "Media";

    const ai_analysis =
      summaryMatch?.[1]?.trim() ||
      "Sin análisis";

    console.log({
      ai_score,
      ai_temperature,
      ai_probability,
      ai_priority,
      ai_analysis,
    });

    const cleanEmail =
      body.email
        ?.trim()
        ?.toLowerCase();

    const {
      data: updateData,
      error,
    } = await supabase

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

      .select();

    console.log(
      "SUPABASE UPDATE:",
      updateData
    );

    console.log(
      "SUPABASE ERROR:",
      error
    );

    return NextResponse.json({

      success: true,

      result,

      updated:
        updateData,

    });

  } catch (error) {

    console.log(
      "ERROR GENERAL:",
      error
    );

    return NextResponse.json({

      success: false,

      result:
        "Error analizando lead",

    });

  }

}