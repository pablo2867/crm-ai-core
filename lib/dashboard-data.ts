import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getDashboardData() {

  const { data: leads } =
    await supabaseAdmin

      .from("leads")

      .select(`
        id,
        status,
        ai_temperature
      `);

  const nuevos =
    leads?.filter(
      (lead) =>
        lead.status === "Nuevo"
    ).length || 0;

  const contactados =
    leads?.filter(
      (lead) =>
        lead.status === "Contactado"
    ).length || 0;

  const cerrados =
    leads?.filter(
      (lead) =>
        lead.status === "Cerrado"
    ).length || 0;

  const hotLeads =
    leads?.filter(
      (lead) =>
        lead.ai_temperature === "HOT"
    ).length || 0;

  const warmLeads =
    leads?.filter(
      (lead) =>
        lead.ai_temperature === "WARM"
    ).length || 0;

  const conversionRate =
    leads?.length
      ? Math.round(
          (
            cerrados /
            leads.length
          ) * 100
        )
      : 0;

  const estimatedRevenue =
    cerrados * 2500;

  const analyticsData = [
    {
      name: "Nuevo",
      total: nuevos,
    },
    {
      name: "Contactado",
      total: contactados,
    },
    {
      name: "Cerrado",
      total: cerrados,
    },
  ];

  return {

    leads,

    nuevos,

    contactados,

    cerrados,

    hotLeads,

    warmLeads,

    conversionRate,

    estimatedRevenue,

    analyticsData,

  };

}