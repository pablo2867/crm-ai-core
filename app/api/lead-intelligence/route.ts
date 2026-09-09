import { Permissions } from "@/platform/auth/permissions";
import {
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  intelligenceEngine,
} from "@/platform/intelligence";

import {
  authEngine,
} from "@/platform/auth";

export async function GET() {
  try {
    // =======================================
    // AUTHENTICATION
    // =======================================

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.AI_EXECUTE);

    const userId =
      user.id;

    // =======================================
    // LOAD USER LEADS
    // =======================================

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
        userId
      )
      .limit(20);

    if (error) {
      console.error(
        error
      );

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

    // =======================================
    // INTELLIGENCE
    // =======================================

    const results = [];

    for (
      const lead of leads ?? []
    ) {
      const intelligence =
        intelligenceEngine.evaluateLeadRecord({
          email:
            lead.email,

          phone:
            lead.phone,

          company:
            lead.company,

          message:
            lead.message,

          status:
            lead.status,

          ai_score:
            lead.ai_score,

          activities:
            lead.activities,

          reminders:
            lead.reminders,
        });

      const {
        error: updateError,
      } = await supabaseAdmin
        .from("leads")
        .update({
          ai_personality:
            intelligence.personality,
        })
        .eq(
          "id",
          lead.id
        )
        .eq(
          "user_id",
          userId
        )
        .eq(
          "organization_id",
          tenant.organizationId
        )
        .eq(
          "workspace_id",
          tenant.workspaceId
        );

      if (!updateError) {
        await supabaseAdmin
          .from("activities")
          .insert([
            {
              user_id:
                userId,

              organization_id:
                tenant.organizationId,

              workspace_id:
                tenant.workspaceId,

              lead_id:
                lead.id,

              type:
                "AI INTELLIGENCE",

              description:
                `AI asignó personalidad ${intelligence.personality} al lead.`,
            },
          ]);
      }

      results.push({
        lead:
          lead.name,

        score:
          intelligence.score,

        temperature:
          intelligence.temperature,

        personality:
          intelligence.personality,

        priority:
          intelligence.priority,

        risk:
          intelligence.risk,

        activities:
          Array.isArray(
            lead.activities
          )
            ? lead.activities.length
            : 0,

        reminders:
          Array.isArray(
            lead.reminders
          )
            ? lead.reminders.length
            : 0,

        updated:
          !updateError,
      });
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}


