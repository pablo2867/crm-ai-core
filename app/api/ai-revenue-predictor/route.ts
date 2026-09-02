import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { authEngine } from "@/platform/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface LeadRevenue {
  estimated_revenue: number | null;
  close_probability: number | null;
}

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: false,
        currentRevenue: 0,
        forecast30Days: 0,
        forecast90Days: 0,
        growth: 0,
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("leads")
      .select(`
        estimated_revenue,
        close_probability
      `)
      .eq(
        "user_id",
        user.id
      );

    if (error) {
      throw error;
    }

    const leads =
      (data || []) as LeadRevenue[];

    const currentRevenue =
      leads.reduce(
        (sum, lead) =>
          sum +
          Number(
            lead.estimated_revenue || 0
          ),
        0
      );

    const weightedRevenue =
      leads.reduce(
        (sum, lead) =>
          sum +
          (
            Number(
              lead.estimated_revenue || 0
            ) *
            Number(
              lead.close_probability || 0
            )
          ) /
            100,
        0
      );

    const forecast30Days =
      Math.round(
        currentRevenue +
          weightedRevenue
      );

    const forecast90Days =
      Math.round(
        forecast30Days * 1.65
      );

    const growth =
      currentRevenue > 0
        ? Math.round(
            (
              (forecast30Days -
                currentRevenue) /
              currentRevenue
            ) * 100
          )
        : 0;

    return NextResponse.json({
      success: true,
      currentRevenue,
      forecast30Days,
      forecast90Days,
      growth,
      totalLeads:
        leads.length,
    });
  } catch (error) {
    console.error(
      "AI REVENUE PREDICTOR ERROR:",
      error
    );

    return NextResponse.json({
      success: false,
      currentRevenue: 0,
      forecast30Days: 0,
      forecast90Days: 0,
      growth: 0,
      totalLeads: 0,
    });
  }
}
