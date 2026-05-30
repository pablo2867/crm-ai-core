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
          id
        )
      `)

      .limit(20);

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

      // DATOS BASE

      const score =
        lead.ai_score || 0;

      const activities =
        lead.activities?.length || 0;

      const reminders =
        lead.reminders?.length || 0;

      // INTELIGENCIA AI

      let intelligence =
        "friendly";

      // PREMIUM

      if (

        score >= 85 &&

        activities >= 10

      ) {

        intelligence =
          "premium";

      }

      // URGENT

      else if (

        score >= 75 &&

        reminders >= 3

      ) {

        intelligence =
          "urgent";

      }

      // FRIENDLY

      else if (

        score >= 60

      ) {

        intelligence =
          "friendly";

      }

      // SOFT

      else {

        intelligence =
          "soft";

      }

      // GUARDAR EN LEAD

      const {
        error: updateError,
      } = await supabaseAdmin

        .from("leads")

        .update({

          ai_personality:
            intelligence,

        })

        .eq(
          "id",
          lead.id
        );

      // ACTIVITY AI

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AI INTELLIGENCE",

            description:
              `AI asignó personalidad ${intelligence} al lead.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        score,

        activities,

        reminders,

        intelligence,

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