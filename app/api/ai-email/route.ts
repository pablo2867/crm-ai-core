import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS HOT Y PREMIUM

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

      // PERSONALIDAD AI

      const personality =

        lead.ai_personality ||

        "friendly";

      // SUBJECT DINÁMICO

      let subject =
        "Seguimiento comercial";

      // EMAIL DINÁMICO

      let emailContent =
        `Hola ${lead.name}, seguimos disponibles para ayudarte.`;

      // PREMIUM

      if (
        personality === "premium"
      ) {

        subject =
          "Atención prioritaria para tu solicitud";

        emailContent =

          `Hola ${lead.name},

Seguimos preparados para ayudarte de manera personalizada.

Quedamos atentos para continuar contigo.

CRM AI Core`;

      }

      // URGENT

      else if (
        personality === "urgent"
      ) {

        subject =
          "Seguimiento prioritario";

        emailContent =

          `Hola ${lead.name},

Seguimos atentos para avanzar contigo esta semana.

Estamos disponibles para ayudarte.

CRM AI Core`;

      }

      // FRIENDLY

      else if (
        personality === "friendly"
      ) {

        subject =
          "Seguimos en contacto";

        emailContent =

          `Hola ${lead.name},

Queríamos retomar la conversación contigo.

Seguimos disponibles para ayudarte cuando gustes.

CRM AI Core`;

      }

      // SOFT

      else {

        subject =
          "Seguimiento de propuesta";

        emailContent =

          `Hola ${lead.name},

Seguimos atentos por si deseas continuar revisando opciones.

Quedamos disponibles para ayudarte.

CRM AI Core`;

      }

      // GUARDAR ACTIVITY EMAIL

      const {
        error: activityError,
      } = await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AI EMAIL",

            description:
              subject,

          },

        ]);

      results.push({

        lead:
          lead.name,

        personality,

        subject,

        email:
          emailContent,

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