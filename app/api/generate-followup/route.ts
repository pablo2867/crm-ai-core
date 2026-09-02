import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  generateFollowup,
} from "@/platform/services/followup-service";

import {
  authEngine,
} from "@/platform/auth";

const supabase =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(
  request: Request
) {

  try {

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    const body =
      await request.json();

    console.log(
      "FOLLOWUP BODY:",
      body
    );

    const result =
      await generateFollowup({

        name:
          body.name,

        company:
          body.company,

        email:
          body.email,

      });

    console.log(
      "FOLLOWUP IA:",
      result
    );

    const {
      data: updateData,
      error,
    } = await supabase

      .from("leads")

      .update({

        ai_followup:
          result,

      })

      .eq(
        "id",
        Number(body.id)
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

      .select();

    console.log(
      "FOLLOWUP UPDATE:",
      updateData
    );

    console.log(
      "FOLLOWUP ERROR:",
      error
    );

    if (error) {

      return NextResponse.json({

        success:
          false,

        message:
          "Error actualizando lead",

        error,

      }, {
        status: 500,
      });

    }

    return NextResponse.json({

      success:
        true,

      message:
        result,

      updated:
        updateData,

    });

  } catch (error) {

    console.error(
      "FOLLOWUP GENERAL ERROR:",
      error
    );

    return NextResponse.json({

      success:
        false,

      message:
        "Error generando follow-up IA",

      error:
        error instanceof Error
          ? error.message
          : "Unknown error",

    }, {
      status: 500,
    });

  }

}




