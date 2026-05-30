import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  createClient,
} from "@/lib/supabase-server";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json({

        success: false,

      });

    }

    // BUSCAR LEADS DEL USUARIO

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

      .eq(
        "user_id",
        user.id
      )

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

      const pipelineStage =
        lead.pipeline_stage || "NEW";

      // CLOSE PROBABILITY

      let closeProbability =
        10;

      // BASE SCORE

      closeProbability +=
        score * 0.4;

      // ACTIVITIES

      closeProbability +=
        activities * 0.5;

      // REMINDERS

      closeProbability +=
        reminders * 1.5;

      // PERSONALITY BONUS

      if (
        personality === "premium"
      ) {

        closeProbability += 10;

      }

      else if (
        personality === "urgent"
      ) {

        closeProbability += 5;

      }

      // PIPELINE BONUS

      if (
        pipelineStage ===
        "NEGOTIATION"
      ) {

        closeProbability += 15;

      }

      else if (
        pipelineStage ===
        "WON"
      ) {

        closeProbability = 100;

      }

      // LIMITAR

      if (
        closeProbability > 100
      ) {

        closeProbability = 100;

      }

      // REDONDEAR

      closeProbability =
        Math.round(
          closeProbability
        );

      // ESTIMAR REVENUE

      let estimatedRevenue =
        1000;

      if (
        closeProbability >= 90
      ) {

        estimatedRevenue =
          10000;

      }

      else if (
        closeProbability >= 75
      ) {

        estimatedRevenue =
          5000;

      }

      else if (
        closeProbability >= 50
      ) {

        estimatedRevenue =
          2500;

      }

      // GUARDAR EN LEAD

      const {
        error: updateError,
      } = await supabaseAdmin

        .from("leads")

        .update({

          close_probability:
            closeProbability,

          estimated_revenue:
            estimatedRevenue,

        })

        .eq(
          "id",
          lead.id
        )

        .eq(
          "user_id",
          user.id
        );

      // CREAR ACTIVITY

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            type:
              "AI REVENUE",

            description:
              `AI estimó ${closeProbability}% de cierre y revenue de $${estimatedRevenue}.`,

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

        closeProbability,

        estimatedRevenue,

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