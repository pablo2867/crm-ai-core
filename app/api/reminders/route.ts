import {
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  request: Request
) {

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

    /*
    ---------------------------------------
    Input
    ---------------------------------------
    */

    const body =
      await request.json();

    const leadId =
      body.lead_id;

    const title =
      body.title;

    const remindAt =
      body.remind_at;

    if (!leadId || !title || !remindAt) {

      return NextResponse.json(

        {
          success:
            false,

          error:
            "lead_id, title and remind_at are required.",
        },

        {
          status:
            400,
        }

      );

    }

    /*
    ---------------------------------------
    Create Reminder
    ---------------------------------------
    */

    const {
      data: reminderData,
      error: reminderError,
    } =
      await supabaseAdmin

        .from("reminders")

        .insert([

          {

            lead_id:
              leadId,

            user_id:
              user.id,

            organization_id:
              tenant.organizationId,

            workspace_id:
              tenant.workspaceId,

            title,

            remind_at:
              remindAt,

            completed:
              false,

          },

        ])

        .select()

        .single();

    if (reminderError) {

      console.error(
        "REMINDER CREATE ERROR:",
        reminderError
      );

      return NextResponse.json(

        {
          success:
            false,

          error:
            "Error creating reminder.",
        },

        {
          status:
            500,
        }

      );

    }

    /*
    ---------------------------------------
    Create Activity
    ---------------------------------------
    */

    const {
      error: activityError,
    } =
      await supabaseAdmin

        .from("activities")

        .insert([

          {

            lead_id:
              leadId,

            user_id:
              user.id,

            organization_id:
              tenant.organizationId,

            workspace_id:
              tenant.workspaceId,

            type:
              "REMINDER",

            description:
              `Reminder creado: ${title}`,

          },

        ]);

    if (activityError) {

      console.error(
        "REMINDER ACTIVITY ERROR:",
        activityError
      );

      /*
      ---------------------------------------
      El reminder ya fue creado.
      No revertimos aquí para no cambiar
      comportamiento de negocio sin necesidad.
      ---------------------------------------
      */

    }

    return NextResponse.json({

      success:
        true,

      reminder:
        reminderData,

    });

  } catch (error) {

    console.error(
      "REMINDER GENERAL ERROR:",
      error
    );

    return NextResponse.json(

      {
        success:
          false,

        error:
          "Internal Server Error",
      },

      {
        status:
          500,
      }

    );

  }

}
