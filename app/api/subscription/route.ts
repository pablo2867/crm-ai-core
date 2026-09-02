import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

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
          step: "AUTH",
          error: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const { data: memberships, error: membershipError } =
      await supabaseAdmin
        .from("organization_members")
        .select("*")
        .eq("user_id", user.id);

    if (membershipError) {
      return NextResponse.json({
        success: false,
        step: "MEMBERSHIP_QUERY",
        userId: user.id,
        error: membershipError.message,
      });
    }

    const organizationId =
      memberships?.[0]?.organization_id;

    if (!organizationId) {
      return NextResponse.json({
        success: false,
        step: "MEMBERSHIP",
        userId: user.id,
        memberships,
      });
    }

    const { data: subscriptions, error: subscriptionError } =
      await supabaseAdmin
        .from("subscriptions")
        .select("*")
        .eq(
          "organization_id",
          organizationId
        );

    if (subscriptionError) {
      return NextResponse.json({
        success: false,
        step: "SUBSCRIPTION_QUERY",
        userId: user.id,
        organizationId,
        error: subscriptionError.message,
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      organizationId,
      memberships,
      subscriptions,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        step: "EXCEPTION",
        error:
          error instanceof Error
            ? error.message
            : "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
