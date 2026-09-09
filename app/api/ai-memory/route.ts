import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET() {

  try {

    /*
    ---------------------------------------
    Auth + Tenant
    ---------------------------------------
    */

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.AI_MEMORY_VIEW);

    /*
    ---------------------------------------
    Buscar Leads
    ---------------------------------------
    */

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

      .eq(
        "organization_id",
        tenant.organizationId
      )

      .eq(
        "workspace_id",
        tenant.workspaceId
      )

      .limit(10);

    if (error) {

      console.error(error);

      return NextResponse.json({

        success: false,

      });

    }

    const results = [];

    for (
      const lead of leads || []
    ) {

      /*
      ---------------------------------------
      Última actividad
      ---------------------------------------
      */

      const filteredActivities =

        lead.activities?.filter(

          (activity: { type?: string; created_at: string; description?: string }) =>

            activity.type !==
            "AI MEMORY"

        ) || [];

      const latestActivity =

        filteredActivities

          .sort(

            (
              a: { created_at: string },
              b: { created_at: string }
            ) =>

              new Date(
                b.created_at
              ).getTime() -

              new Date(
                a.created_at
              ).getTime()

          )[0];

      /*
      ---------------------------------------
      Última nota
      ---------------------------------------
      */

      const latestNote =

        lead.lead_notes?.sort(

          (
            a: { created_at: string },
            b: { created_at: string }
          ) =>

            new Date(
              b.created_at
            ).getTime() -

            new Date(
              a.created_at
            ).getTime()

        )[0];

      /*
      ---------------------------------------
      AI Memory
      ---------------------------------------
      */

      const memory = {

        lastActivity:

          latestActivity?.description ||

          "Sin actividad reciente.",

        lastNote:

          latestNote?.note ||

          "Sin notas recientes.",

        leadTemperature:
          lead.ai_temperature,

        leadScore:
          lead.ai_score,

      };

      /*
      ---------------------------------------
      Guardar memoria
      ---------------------------------------
      */

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
        )

        .eq(
          "organization_id",
          tenant.organizationId
        )

        .eq(
          "workspace_id",
          tenant.workspaceId
        );

      /*
      ---------------------------------------
      Activity Log
      ---------------------------------------
      */

      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              lead.id,

            user_id:
              user.id,

            organization_id:
              tenant.organizationId,

            workspace_id:
              tenant.workspaceId,

            type:
              "AI MEMORY",

            description:
              "AI actualizó memoria contextual del lead.",

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

  }

  catch (error) {

    console.error(
      "AI MEMORY ERROR:",
      error
    );

    return NextResponse.json({

      success: false,

    });

  }

}





