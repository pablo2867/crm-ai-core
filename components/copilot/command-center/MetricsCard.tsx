"use client";

import type {
  MetricReport,
} from "@/platform/metrics";

interface MetricsCardProps {

  metrics?: MetricReport[];

}

export function MetricsCard({

  metrics = [],

}: MetricsCardProps) {

  if (metrics.length === 0) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-zinc-800
          bg-[#18181B]
          p-5
        "
      >

        <h3
          className="
            text-lg
            font-semibold
          "
        >

          AI Performance

        </h3>

        <p
          className="
            mt-4
            text-zinc-500
          "
        >

          No hay métricas disponibles.

        </p>

      </div>

    );

  }

  const totalDuration = metrics.reduce(

    (sum, metric) => sum + metric.duration,

    0

  );

  const averageDuration =

    totalDuration / metrics.length;

  const fastest = metrics.reduce(

    (a, b) =>

      a.duration < b.duration ? a : b

  );

  const slowest = metrics.reduce(

    (a, b) =>

      a.duration > b.duration ? a : b

  );

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#18181B]
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h3
            className="
              text-lg
              font-semibold
            "
          >

            AI Performance

          </h3>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >

            Indicadores del Runtime

          </p>

        </div>

        <div
          className="
            text-right
          "
        >

          <div
            className="
              text-3xl
              font-bold
              text-cyan-400
            "
          >

            {metrics.length}

          </div>

          <div
            className="
              text-xs
              uppercase
              text-zinc-500
            "
          >

            Metrics

          </div>

        </div>

      </div>

      <div
        className="
          grid
          md:grid-cols-2
          gap-4
        "
      >

        <div
          className="
            rounded-xl
            bg-[#09090B]
            p-4
          "
        >

          <p className="text-xs text-zinc-500">

            Total Runtime

          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-cyan-400
            "
          >

            {totalDuration.toFixed(0)} ms

          </p>

        </div>

        <div
          className="
            rounded-xl
            bg-[#09090B]
            p-4
          "
        >

          <p className="text-xs text-zinc-500">

            Average

          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-emerald-400
            "
          >

            {averageDuration.toFixed(0)} ms

          </p>

        </div>

        <div
          className="
            rounded-xl
            bg-[#09090B]
            p-4
          "
        >

          <p className="text-xs text-zinc-500">

            Fastest Task

          </p>

          <p
            className="
              mt-2
              font-semibold
            "
          >

            {fastest.name}

          </p>

          <p className="text-cyan-400">

            {fastest.duration.toFixed(0)} ms

          </p>

        </div>

        <div
          className="
            rounded-xl
            bg-[#09090B]
            p-4
          "
        >

          <p className="text-xs text-zinc-500">

            Slowest Task

          </p>

          <p
            className="
              mt-2
              font-semibold
            "
          >

            {slowest.name}

          </p>

          <p className="text-amber-400">

            {slowest.duration.toFixed(0)} ms

          </p>

        </div>

      </div>

      <div className="mt-6">

        <h4
          className="
            text-sm
            font-semibold
            mb-3
          "
        >

          Detailed Metrics

        </h4>

        <div className="space-y-2">

          {

            metrics.map((metric) => (

              <div

                key={metric.name}

                className="
                  flex
                  justify-between
                  items-center
                  rounded-xl
                  bg-[#09090B]
                  px-4
                  py-3
                "

              >

                <span>

                  {metric.name}

                </span>

                <span
                  className="
                    font-semibold
                    text-cyan-400
                  "
                >

                  {metric.duration.toFixed(2)} ms

                </span>

              </div>

            ))

          }

        </div>

      </div>

    </div>

  );

}

export default MetricsCard;