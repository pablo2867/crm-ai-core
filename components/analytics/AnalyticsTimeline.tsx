"use client";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

interface Props {

  analytics: AnalyticsDashboardDTO;

}

export default function AnalyticsTimeline({

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

        Execution Timeline

      </h2>

      <div className="mt-6 space-y-3">

        {analytics.timeline.length === 0 ? (

          <p className="text-zinc-500">

            Sin actividad registrada.

          </p>

        ) : (

          analytics.timeline.map((item) => (

            <div

              key={item.date}

              className="
                flex
                justify-between
                items-center
              "

            >

              <span>

                {item.date}

              </span>

              <span
                className="
                  text-blue-400
                  font-bold
                "
              >

                {item.executions}

              </span>

            </div>

          ))

        )}

      </div>

    </div>

  );

}