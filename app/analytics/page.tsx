export const dynamic = "force-dynamic";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  createClient,
} from "@/lib/supabase-server";

import AnalyticsChart
from "@/components/AnalyticsChart";

import AIInsights
from "@/components/AIInsights";

import AIRecommendations
from "@/components/AIRecommendations";

export default async function AnalyticsPage() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  const { data: leads } =
    await supabaseAdmin

      .from("leads")

      .select("*")

      .eq(
        "user_id",
        user.id
      );

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

    <main
      className="
        min-h-screen

        bg-[#09090B]

        text-white

        p-6
        md:p-10

        mt-16
        lg:mt-0
      "
    >

      <div className="mb-10">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI
        </p>

        <h1
          className="
            text-4xl
            md:text-6xl

            font-black

            mt-2
          "
        >
          Analytics CRM
        </h1>

      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4

          gap-6
        "
      >

        <div
          className="
            bg-[#111113]

            p-6

            rounded-3xl

            border
            border-zinc-800
          "
        >

          <p
            className="
              text-zinc-400
            "
          >
            Total Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {totalLeads}
          </h2>

        </div>

        <div
          className="
            bg-red-500/10

            p-6

            rounded-3xl

            border
            border-red-500/20
          "
        >

          <p
            className="
              text-red-400
            "
          >
            HOT Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {hotLeads}
          </h2>

        </div>

        <div
          className="
            bg-yellow-500/10

            p-6

            rounded-3xl

            border
            border-yellow-500/20
          "
        >

          <p
            className="
              text-yellow-400
            "
          >
            WARM Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {warmLeads}
          </h2>

        </div>

        <div
          className="
            bg-blue-500/10

            p-6

            rounded-3xl

            border
            border-blue-500/20
          "
        >

          <p
            className="
              text-blue-400
            "
          >
            COLD Leads
          </p>

          <h2
            className="
              text-5xl
              font-black

              mt-4
            "
          >
            {coldLeads}
          </h2>

        </div>

      </div>

      <AnalyticsChart />

      <AIInsights />

      <AIRecommendations
        leads={leads || []}
      />

    </main>

  );

}