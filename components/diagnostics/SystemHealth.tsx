"use client";

import type { DiagnosticsCardProps } from "./types";

export default function SystemHealth({
  data,
  loading,
}: DiagnosticsCardProps) {
  const healthy =
    data.health?.overallStatus === "healthy";

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
        System Health
      </h2>

      {loading ? (
        <span className="text-zinc-400">
          Loading...
        </span>
      ) : (
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className={`w-3 h-3 rounded-full ${
              healthy
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="text-zinc-300">
            {healthy
              ? "All systems operational"
              : "System requires attention"}
          </span>
        </div>
      )}
    </div>
  );
}