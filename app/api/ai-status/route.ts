import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    // BUSCAR LEADS

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

      .limit(50);

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

      const score =
        lead.ai_score || 0;

      const activitiesCount =
        lead.activities?.length || 0;

      const pendingReminders =
        lead.reminders?.filter(
          (reminder: any) =>
            !reminder.completed
        ).length || 0;

      let newTemperature =
        "COLD";

      // IA STATUS LOGIC

      if (

        score >= 80 ||

        activitiesCount >= 5

      ) {

        newTemperature =
          "HOT";

      }

      else if (

        score >= 50 ||

        activitiesCount >= 2 ||

        pendingReminders >= 1

      ) {

        newTemperature =
          "WARM";

      }

      // ACTUALIZAR LEAD

      const {
        error: updateError,
      } = await supabaseAdmin

        .from("leads")

        .update({

          ai_temperature:
            newTemperature,

        })

        .eq(
          "id",
          lead.id
        );

      // CREAR ACTIVITY

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AI STATUS",

            description:
              `AI actualizó temperatura a ${newTemperature}.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        score,

        activities:
          activitiesCount,

        reminders:
          pendingReminders,

        temperature:
          newTemperature,

        updated:
          !updateError,

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