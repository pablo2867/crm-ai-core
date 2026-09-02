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

    const id =
      body.id;

    if (!id) {

      return NextResponse.json(

        {
          success:
            false,

          error:
            "Reminder id is required.",
        },

        {
          status:
            400,
        }

      );

    }

    /*
    ---------------------------------------
    Complete Reminder
    ---------------------------------------
    */

    const {
      data,
      error,
    } =
      await supabaseAdmin

        .from("reminders")

        .update({

          completed:
            true,

        })

        .eq(
          "id",
          id
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
        )

        .select()
        .maybeSingle();

    if (error) {

      console.error(
        "COMPLETE REMINDER ERROR:",
        error
      );

      return NextResponse.json(

        {
          success:
            false,

          error:
            "Error completing reminder.",
        },

        {
          status:
            500,
        }

      );

    }

    if (!data) {

      return NextResponse.json(

        {
          success:
            false,

          error:
            "Reminder not found.",
        },

        {
          status:
            404,
        }

      );

    }

    return NextResponse.json({

      success:
        true,

      reminder:
        data,

    });

  } catch (error) {

    console.error(
      "COMPLETE REMINDER GENERAL ERROR:",
      error
    );

    return NextResponse.json(

      {
        success:
          false,

        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },

      {
        status:
          500,
      }

    );

  }

}
