"use client";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

interface Props {

  analytics: AnalyticsDashboardDTO;

}

export default function AnalyticsRecent({

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

        Recent Executions

      </h2>

      <div className="mt-6 space-y-4">

        {analytics.recentExecutions.length === 0 ? (

          <p className="text-zinc-500">

            No hay ejecuciones registradas.

          </p>

        ) : (

          analytics.recentExecutions.map(

            (execution, index) => (

              <div

                key={index}

                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-zinc-800
                  pb-3
                "

              >

                <div>

                  <p className="font-semibold">

                    {execution.agent_id}

                  </p>

                  <p className="text-zinc-500 text-sm">

                    {execution.intent ?? "-"}

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-blue-400">

                    {execution.duration} ms

                  </p>

                  <p
                    className={
                      execution.success

                        ? "text-emerald-400"

                        : "text-red-400"
                    }
                  >

                    {execution.success

                      ? "SUCCESS"

                      : "FAILED"}

                  </p>

                </div>

              </div>

            )

          )

        )}

      </div>

    </div>

  );

}