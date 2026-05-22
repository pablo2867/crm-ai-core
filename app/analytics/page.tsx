export const dynamic = "force-dynamic";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export default async function AnalyticsPage() {

  const { data: leads } =
    await supabaseAdmin

      .from("leads")

      .select("*");

  const totalLeads =
    leads?.length || 0;

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

  const coldLeads =
    leads?.filter(
      (lead) =>
        lead.ai_temperature === "COLD"
    ).length || 0;

  return (

    <main className="min-h-screen bg-[#09090B] text-white p-10">

      <h1 className="text-5xl font-black mb-10">
        Analytics CRM
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-zinc-900 p-6 rounded-3xl">

          <p className="text-zinc-400">
            Total Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {totalLeads}
          </h2>

        </div>

        <div className="bg-red-500/20 p-6 rounded-3xl">

          <p className="text-red-400">
            HOT Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {hotLeads}
          </h2>

        </div>

        <div className="bg-yellow-500/20 p-6 rounded-3xl">

          <p className="text-yellow-400">
            WARM Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {warmLeads}
          </h2>

        </div>

        <div className="bg-blue-500/20 p-6 rounded-3xl">

          <p className="text-blue-400">
            COLD Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {coldLeads}
          </h2>

        </div>

      </div>

    </main>

  );

}