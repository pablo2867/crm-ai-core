import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS HOT Y WARM + MEMORIA

    const {
      data: leads,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select("*")

      .in(
        "ai_temperature",
        ["HOT", "WARM"]
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

      // FOLLOWUP BASE

      let generatedFollowup =
        `Hola ${lead.name}, seguimos disponibles para ayudarte.`;

      try {

        // MEMORIA AI

        const memory =

          lead.ai_memory || {};

        const lastActivity =

          memory.lastActivity ||

          "Sin actividad reciente.";

        const lastNote =

          memory.lastNote ||

          "Sin notas recientes.";

        // PROMPT PERSONALITY ENGINE

        const prompt = `

Eres un sistema AI SDR.

Tu trabajo NO es escribir followups.

Tu trabajo es elegir SOLO un estilo.

RESPONDE SOLO UNA PALABRA.

ESTILOS DISPONIBLES:

warm
friendly
soft
urgent
premium

REGLAS:

- solo una palabra
- sin explicaciones
- sin frases
- sin puntuación

Lead temperature:
${lead.ai_temperature}

Última actividad:
${lastActivity}

Última nota:
${lastNote}

`;

        // LLAMADA IA

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

        // ESTILO IA

        const aiStyle =

          aiData
            ?.message
            ?.content

            ?.trim()

            ?.toLowerCase() ||

          "friendly";

        // PERSONALIDAD PERSISTENTE

        const leadPersonality =

          lead.ai_personality ||

          aiStyle;

        // TEMPLATE ENGINE

        const templates = {

          warm: [

            `Hola ${lead.name}, seguimos atentos para ayudarte cuando gustes.`,

            `Hola ${lead.name}, seguimos disponibles para continuar la conversación.`,

          ],

          friendly: [

            `Hola ${lead.name}, podemos continuar revisando opciones esta semana.`,

            `Hola ${lead.name}, seguimos atentos a tu interés reciente.`,

          ],

          soft: [

            `Hola ${lead.name}, quería retomar la conversación sobre nuestra propuesta.`,

            `Hola ${lead.name}, seguimos disponibles para ayudarte.`,

          ],

          urgent: [

            `Hola ${lead.name}, seguimos atentos para avanzar contigo esta semana.`,

            `Hola ${lead.name}, aún podemos ayudarte con tu solicitud.`,

          ],

          premium: [

            `Hola ${lead.name}, seguimos preparados para ayudarte de manera personalizada.`,

            `Hola ${lead.name}, seguimos disponibles para brindarte atención prioritaria.`,

          ],

        };

        const selectedTemplates =

          templates[
            leadPersonality as keyof typeof templates
          ] ||

          templates.friendly;

        generatedFollowup =

          selectedTemplates[
            Math.floor(
              Math.random() *
              selectedTemplates.length
            )
          ];

      } catch (err) {

        console.log(
          "AI FOLLOWUP ERROR",
          err
        );

      }

      // GUARDAR FOLLOWUP

      const {
        error: activityError,
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

      results.push({

        lead:
          lead.name,

        temperature:
          lead.ai_temperature,

        personality:
          lead.ai_personality,

        memory:
          lead.ai_memory,

        followup:
          generatedFollowup,

        saved:
          !activityError,

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