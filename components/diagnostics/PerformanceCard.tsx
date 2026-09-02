"use client";

import type { DiagnosticsCardProps } from "./types";

export default function PerformanceCard({
  data,
  loading,
}: DiagnosticsCardProps) {
  const runtimeMetric = data.metrics.find(
    (metric) => metric.id === "Runtime"
  );

  const runtimeDuration =
    runtimeMetric?.duration ?? "--";

  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#111113]
        p-6
      "
    >
      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        Performance
      </h2>

      {loading ? (
        <span className="text-zinc-400">
          Loading...
        </span>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-zinc-400">
              Runtime
            </span>

            <span className="text-green-400 font-semibold">
              {runtimeDuration} ms
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Metrics
            </span>

            <span className="font-semibold">
              {data.metrics.length}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Timeline Steps
            </span>

            <span className="font-semibold">
              {data.timeline.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}