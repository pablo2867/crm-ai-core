"use client";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

interface Props {

  analytics: AnalyticsDashboardDTO;

}

export default function AnalyticsHealth({

  analytics,

}: Props) {

  const summary =
    analytics.summary;

  const healthScore =

    Math.max(

      0,

      Math.min(

        100,

        summary.successRate

      )

    );

  const status =

    healthScore >= 95

      ? "Healthy"

      : healthScore >= 80

        ? "Warning"

        : "Critical";

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

        AI Health

      </h2>

      <div className="mt-6 space-y-3">

        <div className="flex justify-between">

          <span>Health Score</span>

          <span className="text-emerald-400">

            {healthScore.toFixed(1)}%

          </span>

        </div>

        <div className="flex justify-between">

          <span>Status</span>

          <span>

            {status}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Failed Executions</span>

          <span>

            {summary.failedExecutions}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Average Duration</span>

          <span>

            {summary.averageDuration.toFixed(0)} ms

          </span>

        </div>

      </div>

    </div>

  );

}