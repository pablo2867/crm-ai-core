"use client";

import type {
  RuntimeResult,
} from "@/platform/runtime";

interface RuntimeVisualizerProps {

  runtime?: RuntimeResult;

}

export default function RuntimeVisualizer({

  runtime,

}: RuntimeVisualizerProps) {

  if (!runtime) {

    return null;

  }

  const totalDuration = runtime.metrics.reduce(

    (

      total,

      metric,

    ) => total + metric.duration,

    0,

  );

  return (

    <div
      className="
        mt-4
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        p-4
      "
    >

      <h3
        className="
          mb-4
          text-sm
          font-semibold
          text-cyan-400
        "
      >

        AI Runtime

      </h3>

      <div className="space-y-2">

        {runtime.steps.map(

          (

            step,

            index,

          ) => {

            const metric =
              runtime.metrics.find(

                (

                  item,

                ) => item.id === step.id,

              );

            return (

              <div

                key={`${step.id}-${index}`}

                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  bg-zinc-900
                  px-3
                  py-2
                "

              >

                <div>

                  <div className="text-sm text-white">

                    {step.name}

                  </div>

                  <div className="text-xs text-zinc-500">

                    {step.id}

                  </div>

                </div>

                <div className="text-right">

                  <div
                    className={

                      step.status === "completed"

                        ? "text-green-400 text-sm"

                        : step.status === "failed"

                        ? "text-red-400 text-sm"

                        : "text-yellow-400 text-sm"

                    }

                  >

                    {step.status}

                  </div>

                  {metric && (

                    <div className="text-xs text-zinc-500">

                      {metric.duration}
                      {" "}
                      ms

                    </div>

                  )}

                </div>

              </div>

            );

          },

        )}

      </div>

      <div
        className="
          mt-4
          border-t
          border-zinc-800
          pt-4
        "
      >

        <div className="flex justify-between text-sm">

          <span className="text-zinc-400">

            Tiempo total

          </span>

          <span className="font-semibold text-cyan-400">

            {totalDuration}
            {" "}
            ms

          </span>

        </div>

      </div>

    </div>

  );

}