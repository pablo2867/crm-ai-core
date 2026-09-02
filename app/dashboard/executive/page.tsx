export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getDashboardData } from "@/lib/dashboard-data";

import {
  authEngine,
} from "@/platform/auth";

import AIRevenuePredictor from "@/components/forecast/AIRevenuePredictor";
import AIExecutiveInsights from "@/components/dashboard/AIExecutiveInsights";
import ExecutiveSummary from "@/components/executive/ExecutiveSummary";

import RuntimeStatus from "@/components/command-center/RuntimeStatus";
import AgentMonitor from "@/components/command-center/AgentMonitor";

import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";

import {
  executiveDashboardService,
} from "@/platform/services/executive";

import {
  executiveEngine,
} from "@/platform/executive";

export default async function ExecutiveDashboard() {

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {

    return null;

  }

  /*
  ---------------------------------------
  Executive Dashboard (Legacy)
  ---------------------------------------
  */

  const executive =
    await executiveDashboardService.get(
      user.id
    );

  /*
  ---------------------------------------
  Executive Intelligence Engine (NEW)
  ---------------------------------------
  */

  const executiveReport =
    await executiveEngine.execute(
      user.id
    );

  /*
  ---------------------------------------
  Legacy Dashboard Data
  ---------------------------------------
  */

  const legacyDashboard =
    await getDashboardData(
      user.id
    );

  const {

    leads,

    hotLeads,

    conversionRate,

    estimatedRevenue,

    forecastRevenue,

  } =
    legacyDashboard;

  /*
  ---------------------------------------
  Executive Business
  ---------------------------------------
  */

  const business =
    executive.business;

  /*
  ---------------------------------------
  Top Leads
  ---------------------------------------
  */

  const {

    data: topLeads,

  } =
    await supabaseAdmin
      .from("leads")
      .select(`
        id,
        name,
        company,
        estimated_revenue,
        close_probability
      `)
      .eq(
        "user_id",
        user.id
      )
      .order(
        "close_probability",
        {
          ascending: false,
        }
      )
      .limit(5);

  return (

    <main
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        p-6
        md:p-10
      "
    >

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-zinc-500 text-sm">
          CRM AI CORE
        </p>

        <h1
          className="
            text-4xl
            md:text-6xl
            font-black
            mt-2
          "
        >
          Executive Dashboard
        </h1>

      </div>

      {/* EXECUTIVE SUMMARY */}

      <ExecutiveSummary
        report={executiveReport}
      />

      {/* AI COMMAND CENTER */}

      <RuntimeStatus />

      {/* MULTI AGENT */}

      <AgentMonitor />

      {/* AI ANALYTICS */}

      <AnalyticsOverview />

      {/* BUSINESS KPIs */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mt-10
        "
      >

        <div
          className="
            bg-[#111113]
            border
            border-zinc-800
            rounded-3xl
            p-6
          "
        >

          <p className="text-zinc-400">
            Total Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {leads.length}
          </h2>

        </div>

        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-3xl
            p-6
          "
        >

          <p className="text-red-400">
            HOT Leads
          </p>

          <h2 className="text-5xl font-black mt-4">
            {hotLeads}
          </h2>

        </div>

        <div
          className="
            bg-emerald-500/10
            border
            border-emerald-500/20
            rounded-3xl
            p-6
          "
        >

          <p className="text-emerald-400">
            Revenue Estimado
          </p>

          <h2 className="text-4xl font-black mt-4">
            $
            {estimatedRevenue.toLocaleString()}
          </h2>

        </div>

        <div
          className="
            bg-blue-500/10
            border
            border-blue-500/20
            rounded-3xl
            p-6
          "
        >

          <p className="text-blue-400">
            ConversiÃ³n
          </p>

          <h2 className="text-5xl font-black mt-4">
            {conversionRate}
            %
          </h2>

        </div>

      </div>

      {/* FORECAST */}

      <div
        className="
          mt-10
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
        "
      >

        <p className="text-zinc-500 text-sm">
          Forecast IA
        </p>

        <h2 className="text-4xl font-black mt-3">
          $
          {forecastRevenue.toLocaleString()}
        </h2>

      </div>

      {/* AI REVENUE PREDICTOR */}

      <AIRevenuePredictor />

      {/* AI EXECUTIVE INSIGHTS */}

      <AIExecutiveInsights
        userId={user.id}
      />

      {/* TOP LEADS */}

      <div
        className="
          mt-10
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
        "
      >

        <div className="mb-8">

          <p className="text-zinc-500 text-sm">
            Top Leads
          </p>

          <h2 className="text-3xl font-black mt-2">
            Revenue Opportunities
          </h2>

        </div>

        <div className="space-y-4">

          {(topLeads ?? []).map((lead) => (

            <div
              key={lead.id}
              className="
                bg-[#18181B]
                border
                border-zinc-800
                rounded-2xl
                p-5
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3 className="font-bold text-lg">
                  {lead.name}
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  {lead.company}
                </p>

              </div>

              <div className="text-right">

                <p className="text-emerald-400 font-bold">
                  $
                  {(lead.estimated_revenue ?? 0).toLocaleString()}
                </p>

                <p className="text-zinc-400 text-sm">
                  {lead.close_probability ?? 0}
                  % close
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}

