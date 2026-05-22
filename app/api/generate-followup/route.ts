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

    console.log(
      "FOLLOWUP BODY:",
      body
    );

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
Escribe un mensaje profesional y corto de seguimiento comercial para ${body.name}.

Máximo 2 oraciones.
Tono amable y natural.
`,

            stream: false,

            options: {
              num_predict: 60,
            },

          }),

        }

      );

    const data =
      await response.json();

    console.log(
      "OLLAMA RESPONSE:",
      data
    );

    const result =
      (
        data.response || ""
      ).trim();

    console.log(
      "FOLLOWUP IA:",
      result
    );

    const {
      data: updateData,
      error,
    } = await supabase

      .from("leads")

      .update({

        ai_followup:
          result,

      })

      .eq(
        "id",
        Number(body.id)
      )

      .select();

    console.log(
      "FOLLOWUP UPDATE:",
      updateData
    );

    console.log(
      "FOLLOWUP ERROR:",
      error
    );

    return NextResponse.json({

      success: true,

      message:
        result,

    });

  } catch (error) {

    console.log(
      "FOLLOWUP GENERAL ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

      message:
        "Error generando follow-up IA",

    });

  }

}