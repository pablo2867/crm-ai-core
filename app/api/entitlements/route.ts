import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { billingEngine } from "@/platform/billing";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const { data: membership, error } =
      await supabaseAdmin
        .from("organization_members")
        .select(
          "organization_id, workspace_id, role"
        )
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!membership) {
      return NextResponse.json(
        {
          success: false,
          error: "ORGANIZATION_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const subscription =
      await billingEngine.get(
        membership.organization_id
      );

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "SUBSCRIPTION_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    const entitlements =
      billingEngine.getEntitlements(
        subscription.plan
      );

    return NextResponse.json({
      success: true,
      organizationId:
        membership.organization_id,
      workspaceId:
        membership.workspace_id,
      plan:
        subscription.plan,
      status:
        subscription.status,
      entitlements,
    });

  } catch (error) {
    console.error(
      "ENTITLEMENTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "ENTITLEMENTS_FETCH_FAILED",
      },
      { status: 500 }
    );
  }
}
