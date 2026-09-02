"use client";

import type { DiagnosticsCardProps } from "./types";

export default function RuntimeMonitor({
  data,
  loading,
}: DiagnosticsCardProps) {
  const runtime = data.runtime;

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
          mb-6
        "
      >
        Runtime Monitor
      </h2>

      {loading ? (
        <span className="text-zinc-400">
          Loading...
        </span>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-zinc-400">
              Status
            </span>

            <span
              className={`font-semibold ${
                runtime
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {runtime ? "Running" : "Stopped"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Steps
            </span>

            <span className="font-bold">
              {runtime?.steps.length ?? 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              Metrics
            </span>

            <span className="font-bold">
              {data.metrics.length}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">
              History
            </span>

            <span className="font-bold">
              {data.history.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}