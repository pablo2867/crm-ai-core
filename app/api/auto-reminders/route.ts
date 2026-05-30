import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS HOT Y WARM

    const {
      data: hotLeads,
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
      const lead of hotLeads || []
    ) {

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
              `Dar seguimiento a ${lead.name}`,

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

      // CREAR ACTIVIDAD

      const {
        error: activityError,
      } = await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AUTO REMINDER",

            description:
              `Se creó reminder automático para lead ${lead.ai_temperature}.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        temperature:
          lead.ai_temperature,

        reminder:
          !reminderError,

        activity:
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