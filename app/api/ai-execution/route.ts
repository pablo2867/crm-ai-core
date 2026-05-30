import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS HOT

    const {
      data: leads,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select(`
        *,
        activities (
          id
        ),
        reminders (
          id,
          completed
        )
      `)

      .eq(
        "ai_temperature",
        "HOT"
      )

      .limit(10);

    if (error) {

      console.log(error);

      return NextResponse.json({

        success: false,

      });

    }

    const results = [];

    for (
      const lead of leads || []
    ) {

      // FALLBACK BASE

      let generatedFollowup =
        `Hola ${lead.name}, seguimos atentos para ayudarte.`;

      try {

        const prompt = `

Eres un ejecutivo comercial profesional.

Genera un followup corto y humano.

REGLAS:

- solo español
- máximo 12 palabras
- tono profesional
- una sola frase
- sin emojis
- sin explicaciones
- no inventes reuniones
- no inventes llamadas
- no menciones LinkedIn
- no uses preguntas raras

Lead:
${lead.name}

Empresa:
${lead.company}

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
                  "qwen2.5:3b",

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

        // LIMPIAR RESPUESTA

        rawText =

          rawText

            .split("\n")[0]

            .split(".")[0]

            .replace(
              /[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ,¿?]/g,
              ""
            )

            .trim();

        // AI GUARDRAILS

        const invalidPatterns = [

          "LinkedIn",
          "reunión",
          "llamada",
          "zoom",
          "meet",
          "agenda",
          "calendario",
          "email",
          "correo",
          "WhatsApp",
          "seguimiento de tu interés",
          "proyecto perser",
          "¿Cómo estuvo",
          "cómo estás",
          "cómo estuvo",
          "podemos discutir",

        ];

        const invalidResponse =

          rawText.length < 10 ||

          rawText.length > 80 ||

          invalidPatterns.some(
            (pattern) =>

              rawText
                .toLowerCase()
                .includes(
                  pattern.toLowerCase()
                )
          );

        // FALLBACK PROFESIONAL

        if (invalidResponse) {

          const templates = [

            `Hola ${lead.name}, seguimos atentos para ayudarte cuando gustes.`,

            `Hola ${lead.name}, podemos continuar revisando opciones esta semana.`,

            `Hola ${lead.name}, seguimos disponibles para ayudarte en lo que necesites.`,

            `Hola ${lead.name}, quería retomar la conversación sobre nuestra propuesta.`,

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
          "FOLLOWUP AI ERROR",
          err
        );

      }

      // CREAR REMINDER

      const {
        error: reminderError,
      } = await supabaseAdmin

        .from("reminders")

        .insert([

          {

            lead_id:
              lead.id,

            title:
              `Seguimiento HOT lead ${lead.name}`,

            remind_at:
              new Date(
                Date.now() +
                1000 *
                60 *
                60 *
                24
              ),

            completed:
              false,

          },

        ]);

      // CREAR FOLLOWUP ACTIVITY

      const {
        error: followupError,
      } = await supabaseAdmin

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

      // CREAR AI EXECUTION ACTIVITY

      const {
        error: executionError,
      } = await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AI EXECUTION",

            description:
              `AI ejecutó acciones automáticas para HOT lead.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        temperature:
          lead.ai_temperature,

        followup:
          generatedFollowup,

        reminder:
          !reminderError,

        followupSaved:
          !followupError,

        execution:
          !executionError,

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