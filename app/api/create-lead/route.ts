import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      name,
      company,
      email,
      phone,
      user_id,
    } = body;

    let ai_score = 60;

    let ai_temperature =
      "WARM";

    // SCORE BASE

    if (
      company &&
      company.length > 3
    ) {

      ai_score += 10;

    }

    if (
      phone
    ) {

      ai_score += 10;

    }

    if (
      email?.includes(
        "@gmail"
      )
    ) {

      ai_score += 5;

    }

    if (
      email?.includes(
        "@company"
      )
    ) {

      ai_score += 20;

    }

    if (
      ai_score >= 85
    ) {

      ai_temperature =
        "HOT";

    } else if (
      ai_score <= 50
    ) {

      ai_temperature =
        "COLD";

    }

    // IA ANALYSIS

    const aiPrompt = `

Analiza este lead comercial.

Nombre:
${name}

Empresa:
${company}

Email:
${email}

Teléfono:
${phone}

Temperatura:
${ai_temperature}

Score:
${ai_score}

Genera:

1. análisis corto
2. followup comercial corto
3. acción recomendada
4. probabilidad de cierre

Formato JSON:

{
  "analysis": "...",
  "followup": "...",
  "action": "...",
  "close_probability": "..."
}

`;

    let ai_analysis =
      "Lead interesado.";

    let ai_followup =
      "Hola, quería darte seguimiento.";

    let ai_action =
      "Enviar seguimiento.";

    let ai_close_probability =
      "50%";

    try {

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
                    aiPrompt,
                },

              ],

            }),

          }
        );

      const aiData =
        await aiResponse.json();

      const rawText =
        aiData
          ?.message
          ?.content || "";

      console.log(rawText);

      const jsonMatch =
        rawText.match(
          /\{[\s\S]*\}/
        );

      if (jsonMatch) {

        const parsed =
          JSON.parse(
            jsonMatch[0]
          );

        ai_analysis =
          parsed.analysis ||
          ai_analysis;

        ai_followup =
          parsed.followup ||
          ai_followup;

        ai_action =
          parsed.action ||
          ai_action;

        ai_close_probability =
          parsed.close_probability ||
          ai_close_probability;

      }

    } catch (err) {

      console.log(
        "IA ERROR",
        err
      );

    }

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("leads")

      .insert([

        {

          name,
          company,
          email,
          phone,

          user_id,

          status:
            "Nuevo",

          ai_score,

          ai_temperature,

          ai_analysis,

          ai_followup,

          ai_action,

          ai_close_probability,

        },

      ])

      .select()

      .single();

    // AUTO ACTIVITY

    if (
      data &&
      ai_temperature === "HOT"
    ) {

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              data.id,

            type:
              "AI PRIORITY",

            description:
              `Lead HOT detectado automáticamente (${ai_close_probability})`,

          },

        ]);

    }

    // AUTO REMINDER

    if (
      data &&
      ai_temperature === "HOT"
    ) {

      const tomorrow =
        new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      await supabaseAdmin

        .from("reminders")

        .insert([

          {

            lead_id:
              data.id,

            title:
              `Llamar lead HOT: ${name}`,

            remind_at:
              tomorrow,

            completed:
              false,

          },

        ]);

    }

    if (error) {

      console.log(error);

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json({

      success: true,

      data,

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }

}