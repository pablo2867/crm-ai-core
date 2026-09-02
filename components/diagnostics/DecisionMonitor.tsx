"use client";

import type { DiagnosticsCardProps } from "./types";

export default function DecisionMonitor({
  data,
  loading,
}: DiagnosticsCardProps) {
  const decision = data.decision;

  const confidence =
    decision?.confidence ?? 0;

  const confidencePercent =
    Math.round(confidence * 100);

  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >
      <h2 className="text-xl font-bold mb-6">
        Decision Engine
      </h2>

      {loading ? (
        <span className="text-zinc-400">
          Loading...
        </span>
      ) : (
        <div className="space-y-4 text-sm">

          <div>
            <div className="text-zinc-500">
              Workflow ID
            </div>

            <div className="font-semibold">
              {decision?.workflowId ?? "-"}
            </div>
          </div>

          <div>
            <div className="text-zinc-500">
              Workflow
            </div>

            <div className="font-semibold">
              {decision?.workflow?.name ?? "-"}
            </div>
          </div>

          <div>
            <div className="text-zinc-500">
              Confidence
            </div>

            <div className="font-semibold">
              {confidencePercent}%
            </div>
          </div>

          <div>
            <div className="text-zinc-500">
              Score
            </div>

            <div className="font-semibold">
              {decision?.selectedScore ?? 0}
            </div>
          </div>

          <div>
            <div className="text-zinc-500">
              Reason
            </div>

            <div className="font-semibold">
              {decision?.reason ?? "-"}
            </div>
          </div>

          <div>
            <div className="text-zinc-500">
              Candidates
            </div>

            <div className="font-semibold">
              {decision?.ranking.length ?? 0}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}