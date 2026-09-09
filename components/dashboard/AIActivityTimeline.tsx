"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string;
  workflow: string;
  skill: string;
  status: "success" | "error" | "running";
  durationMs?: number;
}

export default function AIActivityTimeline() {

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;

    const loadActivities = async () => {

      controller = new AbortController();

      const timeout =
        setTimeout(
          () => controller?.abort(),
          10000
        );

      try {

        const response =
          await fetch(
            "/api/ai-activity",
            {
              cache: "no-store",
              signal: controller.signal,
            }
          );

        if (!response.ok) {

          throw new Error(
            `AI Activity HTTP ${response.status}`
          );

        }

        const data =
          await response.json();

        if (!cancelled && data.success) {

          setActivities(
            (data.activities ?? []).slice(0, 10)
          );

        }

      } catch (error) {

        if (
          !cancelled &&
          error instanceof Error &&
          error.name !== "AbortError"
        ) {

          console.error(
            "AI Activity:",
            error
          );

        }

      } finally {

        clearTimeout(timeout);

        if (!cancelled) {

          setLoading(false);

          timer =
            setTimeout(
              loadActivities,
              15000
            );

        }

      }

    };

    loadActivities();

    return () => {

      cancelled = true;

      if (timer) {

        clearTimeout(timer);

      }

      controller?.abort();

    };

  }, []);
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

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black">
            AI Activity
          </h2>

          <p className="text-zinc-500 text-sm mt-1">
            Últimos workflows ejecutados
          </p>

        </div>

        <span
          className="
            rounded-full
            bg-green-500/20
            px-3
            py-1
            text-xs
            text-green-400
            font-semibold
          "
        >
          LIVE
        </span>

      </div>

      <div
        className="
          mt-6
          max-h-[420px]
          overflow-y-auto
          space-y-3
        "
      >

        {loading && (

          <div className="text-zinc-500">

            Cargando actividad...

          </div>

        )}

        {!loading &&
          activities.length === 0 && (

            <div className="text-zinc-500">

              No hay actividad registrada.

            </div>

        )}

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="
              rounded-xl
              border
              border-zinc-800
              bg-[#18181B]
              p-4
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="text-xl">

                  {activity.status === "success"
                    ? "✅"
                    : activity.status === "running"
                    ? "🟡"
                    : "❌"}

                </span>

                <div>

                  <div className="font-semibold text-white">

                    {activity.workflow}

                  </div>

                  <div className="text-sm text-zinc-400">

                    Skill: {activity.skill}

                  </div>

                </div>

              </div>

              <div className="text-xs text-zinc-500">

                {activity.durationMs ?? 0} ms

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}


