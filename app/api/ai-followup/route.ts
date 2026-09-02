
import {
  aiUsageEngine,
} from "@/platform/billing/usage";

import {
  NextResponse,
} from "next/server";

import {
  createClient as createSupabaseAdmin,
} from "@supabase/supabase-js";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  generateFollowup,
} from "@/platform/services/followup-service";

import {
  activityService,
} from "@/platform/activity";

import {
  billingEngine,
} from "@/platform/billing";

const supabase =
  createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function POST(
  req: Request
) {

  const requestStartedAt =
    Date.now();

  try {

    const body =
      await req.json();

    const {
      id,
      name,
      company,
      email,
    } = body;

    /*
    ---------------------------------------
    AUTH
    ---------------------------------------
    */

    const authStartedAt =
      Date.now();

    const authClient =
      await createClient();

    const {
      data: { user },
    } =
      await authClient.auth.getUser();

    console.log(
      "[FOLLOWUP TIMING] auth:",
      Date.now() - authStartedAt,
      "ms"
    );

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    /*
    ---------------------------------------
    ORGANIZATION
    ---------------------------------------
    */

    const membershipStartedAt =
      Date.now();

    const {
      data: membership,
      error: membershipError,
    } =
      await supabase
        .from("organization_members")
        .select(
          "organization_id, workspace_id, role"
        )
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "active",
          true
        )
        .limit(1)
        .maybeSingle();

    console.log(
      "[FOLLOWUP TIMING] membership:",
      Date.now() - membershipStartedAt,
      "ms"
    );

    if (membershipError) {
      throw membershipError;
    }

    if (!membership) {

      return NextResponse.json(
        {
          success: false,
          error: "ORGANIZATION_NOT_FOUND",
        },
        {
          status: 404,
        }
      );

    }

    /*
    ---------------------------------------
    SUBSCRIPTION
    ---------------------------------------
    */

    const subscriptionStartedAt =
      Date.now();

    const subscription =
      await billingEngine.get(
        membership.organization_id
      );

    console.log(
      "[FOLLOWUP TIMING] subscription:",
      Date.now() - subscriptionStartedAt,
      "ms"
    );

    if (!subscription) {

      return NextResponse.json(
        {
          success: false,
          error: "SUBSCRIPTION_NOT_FOUND",
        },
        {
          status: 404,
        }
      );

    }


    /*
    /*
    ---------------------------------------
    FOLLOW-UP USAGE
    ---------------------------------------
    */

    const usage =
      await aiUsageEngine.checkFollowup({

        organizationId:
          membership.organization_id,

        userId:
          user.id,

        workflow:
          "sales-followup",

        skill:
          "generate-followup",

        status:
          "success",

        since:
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),

      });

    console.log(
      " [FOLLOWUP USAGE]",
      usage
    );

    if (!usage.allowed) {

      console.log(
        " [FOLLOWUP TIMING] rejected:",
        Date.now() - requestStartedAt,
        " ms"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            usage.reason ??
            "AI_FOLLOWUP_LIMIT_REACHED",
          plan:
            usage.plan ??
            subscription.plan,
          limit:
            usage.limit,
          usage:
            usage.usage,
        },
        {
          status: 403,
        }
      );

    }
    /*
    ---------------------------------------
    GENERATE AI
    ---------------------------------------
    */

    const aiStartedAt =
      Date.now();

    const aiText =
      await generateFollowup({
        name,
        company,
        email,
      });

    const aiDuration =
      Date.now() - aiStartedAt;

    /*
    ---------------------------------------
    UPDATE LEAD
    ---------------------------------------
    */

    const {
      data: updateData,
      error,
    } =
      await supabase
        .from("leads")
        .update({
          ai_followup:
            aiText,
        })
        .eq(
          "id",
          Number(id)
        )
        .eq(
          "user_id",
          user.id
        )
        .select();

    if (error) {
      throw error;
    }

    /*
    ---------------------------------------
    REGISTER USAGE
    ---------------------------------------
    */

    activityService.add({

      id:
        crypto.randomUUID(),

      userId:
        user.id,

      
      organizationId:
        membership.organization_id,

      workspaceId:
        membership.workspace_id,
workflow:
        "sales-followup",

      skill:
        "generate-followup",

      status:
        "success",

      message:
        "AI Follow-up generado",

      createdAt:
        new Date(),

      durationMs:
        aiDuration,

      data: {
        organizationId:
          membership.organization_id,

        workspaceId:
          membership.workspace_id,

        leadId:
          Number(id),

        plan:
          subscription.plan,
      },

    });

    return NextResponse.json({

      success:
        true,

      text:
        aiText,

      updated:
        updateData,

      usage:
        usage.usage + 1,

      limit:
        usage.limit,

      plan:
        subscription.plan,

      durationMs:
        Date.now() -
        requestStartedAt,

    });

  } catch (error) {

    console.error(
      "AI FOLLOWUP ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "FOLLOWUP_GENERATION_FAILED",
      },
      {
        status: 500,
      }
    );

  }

}

