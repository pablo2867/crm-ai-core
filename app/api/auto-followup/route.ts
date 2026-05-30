import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS SIN MOVIMIENTO

    const {
      data: leads,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select("*")

      .in(
        "ai_temperature",
        ["COLD", "WARM"]
      )

      .limit(10);

    if (error) {

      console.log(error);

      return NextResponse.json({
        success: false,
      });

    }

    const results = [];

    for (const lead of leads || []) {

      let generatedFollowup =
        `Hola ${lead.name}, quería retomar la conversación contigo.`;

      try {

        const prompt = `

Eres un SDR profesional.

Genera SOLO un followup comercial.

REGLAS:

- máximo 15 palabras
- solo español
- no expliques nada
- no hagas listas
- no uses títulos
- no uses introducciones
- responde directo
- no repitas instrucciones

Lead:
${lead.name}

Empresa:
${lead.company}

Temperatura:
${lead.ai_temperature}

`;

        const aiResponse =
          await fetch(
            "http://127.0.0.1:11434/api/chat",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

              },

              body: JSON.stringify({

                model:
                  "tinyllama:latest",

                stream: false,

                messages: [

                  {
                    role:
                      "user",

                    content:
                      prompt,
                  },

                ],

              }),

            }
          );

        const aiData =
          await aiResponse.json();

        let rawText =

          aiData
            ?.message
            ?.content ||

          generatedFollowup;

        // EXTRAER SOLO PRIMERA FRASE

        rawText =

          rawText

            .split("\n")[0]

            .split(".")[0]

            .replace(
              /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ,¿?]/g,
              ""
            )

            .trim();

        // VALIDAR RESPUESTAS BASURA

        const invalidPatterns = [

          "SDR",
          "Reglas",
          "Followup",
          "Output",
          "professional",
          "commercial",
          "Introducción",
          "DRAMA",
          "SOUND",
          "Microsoft",
          "Excel",
          "Maximo",
          "Solo",
          "SMART",
          "Assistant",
          "SBT",
          "seguros",
          "especializado",
          "voice",
          "Narrator",
          "Music",
          "Scene",
          "Cut",
          "AI",

        ];

        const invalidResponse =

          rawText.length < 15 ||

          invalidPatterns.some(
            (pattern) =>

              rawText.includes(pattern)
          );

        // VALIDAR INICIOS BASURA

        const invalidStarts = [

          "El ",
          "Este ",
          "Solo ",
          "SOUND",
          "SMART",
          "Followup",
          "Introducción",

        ];

        if (

          invalidStarts.some(
            (start) =>

              rawText.startsWith(start)
          )

        ) {

          rawText = "";

        }

        // FALLBACK INTELIGENTE

        if (
          invalidResponse ||
          rawText === ""
        ) {

          const templates = [

            `Hola ${lead.name}, quería saber si aún estás interesado en nuestra propuesta.`,

            `Hola ${lead.name}, seguimos disponibles para ayudarte cuando gustes.`,

            `Hola ${lead.name}, quería retomar la conversación contigo esta semana.`,

            `Hola ${lead.name}, ¿te gustaría continuar revisando opciones juntos?`,

          ];

          rawText =

            templates[
              Math.floor(
                Math.random() *
                templates.length
              )
            ];

        }

        generatedFollowup =
          rawText;

      } catch (err) {

        console.log(
          "FOLLOWUP IA ERROR",
          err
        );

      }

      // GUARDAR FOLLOWUP

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AUTO FOLLOWUP",

            description:
              generatedFollowup,

          },

        ]);

      results.push({

        lead:
          lead.name,

        followup:
          generatedFollowup,

      });

    }

    return NextResponse.json({

      success: true,

      results,

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({

      success: false,

    });

  }

}