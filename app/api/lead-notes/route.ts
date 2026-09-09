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

export async function POST(
  request: Request
) {

  try {

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.CRM_LEADS_UPDATE);

    const body =
      await request.json();

    const leadId =
      body.lead_id;

    const note =
      body.note;

    if (!leadId || !note) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "lead_id and note are required.",
        },
        {
          status:
            400,
        }
      );

    }

    /*
    ---------------------------------------
    Validate Lead Ownership
    ---------------------------------------
    */

    const {
      data: lead,
      error: leadError,
    } =
      await supabaseAdmin

        .from("leads")

        .select("id")

        .eq(
          "id",
          leadId
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

        .maybeSingle();

    if (leadError) {

      console.error(
        "LEAD NOTES LEAD VALIDATION ERROR:",
        leadError
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Unable to validate lead.",
        },
        {
          status:
            500,
        }
      );

    }

    if (!lead) {

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Lead not found.",
        },
        {
          status:
            404,
        }
      );

    }

    /*
    ---------------------------------------
    Insert Note
    ---------------------------------------
    */

    const {
      data,
      error,
    } =
      await supabaseAdmin

        .from("lead_notes")

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

            note,

          },

        ])

        .select();

    if (error) {

      console.error(
        "LEAD NOTE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success:
            false,

          error:
            "Error creating lead note.",
        },
        {
          status:
            500,
        }
      );

    }

    return NextResponse.json({

      success:
        true,

      data,

    });

  } catch (error) {

    console.error(
      "LEAD NOTE GENERAL ERROR:",
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

