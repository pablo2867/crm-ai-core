import { supabaseAdmin } from "@/lib/supabase-admin";

interface Lead {
  id: string;
  pipeline_stage: string | null;
  status: string | null;
  ai_temperature: string | null;
  estimated_revenue: number | null;
  deal_value: number | null;
  close_probability: number | null;
}

export interface DashboardData {
  leads: Lead[];
  nuevos: number;
  contactados: number;
  cerrados: number;
  hotLeads: number;
  warmLeads: number;
  conversionRate: number;
  estimatedRevenue: number;
  forecastRevenue: number;
  forecastGrowth: number;
  analyticsData: {
    name: string;
    total: number;
  }[];
}

export interface DashboardDataOptions {
  organizationId?: string;
  workspaceId?: string;
}

export async function getDashboardData(
  userId?: string,
  options: DashboardDataOptions = {}
): Promise<DashboardData> {
  const start = Date.now();

  try {
    let query = supabaseAdmin
      .from("leads")
      .select(`
        id,
        status,
        pipeline_stage,
        ai_temperature,
        estimated_revenue,
        deal_value,
        close_probability
      `);

    if (userId && userId !== "undefined") {
      query = query.eq("user_id", userId);
    }

    if (options.organizationId) {
      query = query.eq(
        "organization_id",
        options.organizationId
      );
    }

    if (options.workspaceId) {
      query = query.eq(
        "workspace_id",
        options.workspaceId
      );
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const leads: Lead[] = data || [];

    const nuevos = leads.filter(
      (lead) => lead.pipeline_stage === "new"
    ).length;

    const contactados = leads.filter(
      (lead) => lead.pipeline_stage === "contacted"
    ).length;

    const cerrados = leads.filter(
      (lead) => lead.pipeline_stage === "closed_won"
    ).length;

    const hotLeads = leads.filter(
      (lead) => lead.ai_temperature === "HOT"
    ).length;

    const warmLeads = leads.filter(
      (lead) => lead.ai_temperature === "WARM"
    ).length;

    const conversionRate =
      leads.length > 0
        ? Math.round((cerrados / leads.length) * 100)
        : 0;

    const estimatedRevenue = leads.reduce(
      (total, lead) =>
        total +
        Number(
          lead.estimated_revenue ??
            lead.deal_value ??
            0
        ),
      0
    );

    const forecastRevenue = leads.reduce(
      (total, lead) => {
        const revenue = Number(
          lead.estimated_revenue ?? 0
        );

        const probability = Number(
          lead.close_probability ?? 0
        );

        return (
          total +
          Math.round(
            revenue * (probability / 100)
          )
        );
      },
      0
    );

    const forecastGrowth =
      estimatedRevenue > 0
        ? Math.round(
            ((forecastRevenue - estimatedRevenue) /
              estimatedRevenue) *
              100
          )
        : 0;

    const analyticsData = [
      {
        name: "Nuevo",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "new"
        ).length,
      },
      {
        name: "Contactado",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "contacted"
        ).length,
      },
      {
        name: "Calificado",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "qualified"
        ).length,
      },
      {
        name: "Propuesta",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "proposal"
        ).length,
      },
      {
        name: "Ganado",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "closed_won"
        ).length,
      },
      {
        name: "Perdido",
        total: leads.filter(
          (lead) =>
            lead.pipeline_stage === "closed_lost"
        ).length,
      },
    ];

    console.log("========================================");
    console.log("DASHBOARD REVENUE AUDIT");
    console.log("userId:", userId);
    console.log("leads:", leads.length);
    console.log("estimatedRevenue:", estimatedRevenue);
    console.log("forecastRevenue:", forecastRevenue);
    console.log(
      "dealValueTotal:",
      leads.reduce(
        (sum, lead) =>
          sum + Number(lead.deal_value ?? 0),
        0
      )
    );
    console.log("========================================");

    console.log(
      "DASHBOARD_DATA:",
      `${Date.now() - start}ms`
    );

    return {
      leads,
      nuevos,
      contactados,
      cerrados,
      hotLeads,
      warmLeads,
      conversionRate,
      estimatedRevenue,
      forecastRevenue,
      forecastGrowth,
      analyticsData,
    };
  } catch (error) {
    console.error(
      "DASHBOARD DATA ERROR:",
      error
    );

    return {
      leads: [],
      nuevos: 0,
      contactados: 0,
      cerrados: 0,
      hotLeads: 0,
      warmLeads: 0,
      conversionRate: 0,
      estimatedRevenue: 0,
      forecastRevenue: 0,
      forecastGrowth: 0,
      analyticsData: [],
    };
  }
}







