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
          id,
          type,
          description,
          created_at
        ),
        lead_notes (
          id,
          note,
          created_at
        )
      `)

      .eq(
        "user_id",
        user.id
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

      // FILTRAR ACTIVIDADES INTERNAS AI

      const filteredActivities =

        lead.activities?.filter(
          (activity: any) =>

            activity.type !==
            "AI MEMORY"
        ) || [];

      // ÚLTIMA ACTIVIDAD REAL

      const latestActivity =

        filteredActivities.sort(
          (
            a: any,
            b: any
          ) =>

            new Date(
              b.created_at
            ).getTime() -

            new Date(
              a.created_at
            ).getTime()
        )[0];

      // ÚLTIMA NOTA

      const latestNote =

        lead.lead_notes?.sort(
          (
            a: any,
            b: any
          ) =>

            new Date(
              b.created_at
            ).getTime() -

            new Date(
              a.created_at
            ).getTime()
        )[0];

      // CREAR MEMORIA AI

      const memory = {

        lastActivity:

          latestActivity
            ?.description ||

          "Sin actividad reciente.",

        lastNote:

          latestNote
            ?.note ||

          "Sin notas recientes.",

        leadTemperature:
          lead.ai_temperature,

        leadScore:
          lead.ai_score,

      };

      // GUARDAR MEMORIA

      const {
        error: updateError,
      } = await supabaseAdmin

        .from("leads")

        .update({

          ai_memory:
            memory,

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
              "AI MEMORY",

            description:
              `AI actualizó memoria contextual del lead.`,

          },

        ]);

      results.push({

        lead:
          lead.name,

        memory,

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