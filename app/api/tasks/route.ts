import { NextResponse } from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const { id } = body;

    if (!id) {

      return NextResponse.json(

        {

          success: false,

          error:
            "Task id is required.",

        },

        {

          status: 400,

        }

      );

    }

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
    Complete Task
    ---------------------------------------
    */

    const { error } =
      await supabaseAdmin

        .from("tasks")

        .update({

          status:
            "completed",

          completed_at:
            new Date().toISOString(),

        })

        .eq("id", id)

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

    if (error) {

      return NextResponse.json(

        {

          success: false,

          error:
            error.message,

        },

        {

          status: 500,

        }

      );

    }

    return NextResponse.json({

      success: true,

      message:
        "Task completed successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        error:

          error instanceof Error

            ? error.message

            : "Internal Server Error",

      },

      {

        status: 500,

      }

    );

  }

}

export async function DELETE(
  req: Request
) {

  try {

    const body =
      await req.json();

    const { id } = body;

    if (!id) {

      return NextResponse.json(

        {

          success: false,

          error:
            "Task id is required.",

        },

        {

          status: 400,

        }

      );

    }

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
    Delete Task
    ---------------------------------------
    */

    const { error } =
      await supabaseAdmin

        .from("tasks")

        .delete()

        .eq("id", id)

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

    if (error) {

      return NextResponse.json(

        {

          success: false,

          error:
            error.message,

        },

        {

          status: 500,

        }

      );

    }

    return NextResponse.json({

      success: true,

      message:
        "Task deleted successfully.",

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        error:

          error instanceof Error

            ? error.message

            : "Internal Server Error",

      },

      {

        status: 500,

      }

    );

  }

}