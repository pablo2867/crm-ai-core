"use client";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

interface Props {

  analytics: AnalyticsDashboardDTO;

}

export default function AnalyticsCards({

  analytics,

}: Props) {

  const summary =
    analytics.summary;

  const cards = [

    {

      title:
        "AI Executions",

      value:
        summary.totalExecutions,

    },

    {

      title:
        "Success Rate",

      value:
        `${summary.successRate.toFixed(1)}%`,

    },

    {

      title:
        "Avg Duration",

      value:
        `${summary.averageDuration.toFixed(0)} ms`,

    },

    {

      title:
        "Top Agent",

      value:
        summary.mostUsedAgent ?? "-",

    },

  ];

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      {cards.map((card) => (

        <div

          key={card.title}

          className="
            bg-[#111113]
            border
            border-zinc-800
            rounded-3xl
            p-6
          "

        >

          <p className="text-zinc-500">

            {card.title}

          </p>

          <h2
            className="
              text-4xl
              font-black
              mt-4
            "
          >

            {card.value}

          </h2>

        </div>

      ))}

    </div>

  );

}