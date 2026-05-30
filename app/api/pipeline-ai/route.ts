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

      // DATOS

      const score =
        lead.ai_score || 0;

      const activities =
        lead.activities?.length || 0;

      const reminders =
        lead.reminders?.length || 0;

      const personality =
        lead.ai_personality || "friendly";

      // PIPELINE STATUS

      let pipelineStage =
        "NEW";

      // WON

      if (

        score >= 90 &&

        activities >= 15

      ) {

        pipelineStage =
          "WON";

      }

      // NEGOTIATION

      else if (

        score >= 85

      ) {

        pipelineStage =
          "NEGOTIATION";

      }

      // QUALIFIED

      else if (

        score >= 70 &&

        reminders >= 2

      ) {

        pipelineStage =
          "QUALIFIED";

      }

      // CONTACTED

      else if (

        score >= 50

      ) {

        pipelineStage =
          "CONTACTED";

      }

      // LOST

      else {

        pipelineStage =
          "LOST";

      }

      // GUARDAR STAGE

      const {
        error: updateError,
      } = await supabaseAdmin

        .from("leads")

        .update({

          pipeline_stage:
            pipelineStage,

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
              "AI PIPELINE",

            description:
              `AI movió lead a ${pipelineStage}.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        score,

        activities,

        reminders,

        personality,

        pipelineStage,

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