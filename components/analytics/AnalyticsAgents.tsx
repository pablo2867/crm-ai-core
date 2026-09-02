"use client";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

interface Props {

  analytics: AnalyticsDashboardDTO;

}

export default function AnalyticsAgents({

  analytics,

}: Props) {

  return (

    <div
      className="
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
      "
    >

      <h2 className="text-2xl font-black">

        Agent Ranking

      </h2>

      <div className="mt-6 space-y-4">

        {analytics.topAgents.length === 0 ? (

          <p className="text-zinc-500">

            No hay agentes registrados.

          </p>

        ) : (

          analytics.topAgents.map((agent) => (

            <div

              key={agent.agent}

              className="
                flex
                items-center
                justify-between
              "

            >

              <span>

                {agent.agent}

              </span>

              <span
                className="
                  text-emerald-400
                  font-bold
                "
              >

                {agent.executions}

              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}