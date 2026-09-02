import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { authEngine } from "@/platform/auth";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        success: false,
      });
    }

    const tenant =
    await authEngine.getTenant();

  const { data: leads, error } =
      await supabaseAdmin
        .from("leads")
        .select(`
          id,
          name,
          ai_score,
          ai_temperature,
          close_probability,
          estimated_revenue,
          status
        `)
        .eq("user_id", user.id)
      .eq("organization_id", tenant.organizationId)
      .eq("workspace_id", tenant.workspaceId);

    if (error) {
      throw error;
    }

    const totalLeads =
      leads?.length || 0;

    const hotLeads =
      leads?.filter(
        (lead) =>
          lead.ai_temperature === "HOT"
      ).length || 0;

    const closedLeads =
      leads?.filter(
        (lead) =>
          lead.status === "Cerrado"
      ).length || 0;

    const conversionRate =
      totalLeads > 0
        ? Math.round(
            (closedLeads / totalLeads) *
              100
          )
        : 0;

    const forecastRevenue =
      leads?.reduce(
        (total, lead) =>
          total +
          Math.round(
            Number(
              lead.estimated_revenue || 0
            ) *
              (Number(
                lead.close_probability || 0
              ) / 100)
          ),
        0
      ) || 0;

    const bestLead =
      [...(leads || [])].sort(
        (a, b) =>
          (b.ai_score || 0) -
          (a.ai_score || 0)
      )[0];

    const riskLeads =
      leads?.filter(
        (lead) =>
          lead.ai_temperature === "COLD"
      ).length || 0;

    return NextResponse.json({
      success: true,
      forecastRevenue,
      hotLeads,
      conversionRate,
      bestLead:
        bestLead?.name ||
        "Sin datos",
      bestLeadId:
        bestLead?.id || null,
      score:
        bestLead?.ai_score || 0,
      probability:
        bestLead?.close_probability || 0,
      revenue:
        bestLead?.estimated_revenue || 0,
      riskLeads,
    });
  } catch (error) {
    console.error(
      "COPILOT DASHBOARD ERROR:",
      error
    );

    return NextResponse.json({
      success: false,
    });
  }
}



