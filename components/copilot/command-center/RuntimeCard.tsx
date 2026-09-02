"use client";

import type {
  RuntimeCardProps,
} from "./types";

export function RuntimeCard({

  runtime,

}: RuntimeCardProps) {

  if (!runtime) {

    return null;

  }

  const completed =
    runtime.steps.filter(
      step => step.status === "completed"
    ).length;

  const running =
    runtime.steps.filter(
      step => step.status === "running"
    ).length;

  const failed =
    runtime.steps.filter(
      step => step.status === "failed"
    ).length;

  const totalSteps =
    runtime.steps.length;

  const runtimeMetric =
    runtime.metrics?.find(
      metric => metric.id === "Runtime"
    );

  const totalDuration =
    runtimeMetric?.duration ?? 0;

  const averageDuration =
    totalSteps > 0
      ? totalDuration / totalSteps
      : 0;

  const progress =
    totalSteps > 0
      ? Math.round(
          (completed / totalSteps) * 100
        )
      : 0;

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

            Runtime Engine

          </h3>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >

            Estado del Kernel

          </p>

        </div>

        <div
          className={`
            text-lg
            font-bold
            ${
              runtime.success
                ? "text-emerald-400"
                : "text-red-400"
            }
          `}
        >

          {

            runtime.success
              ? "ONLINE"
              : "ERROR"

          }

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

            Runtime Progress

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-cyan-400
            "
          >

            {progress}%

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

            Total Steps

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-white
            "
          >

            {totalSteps}

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

            Completed

          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-emerald-400
            "
          >

            {completed}

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

            Running

          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-yellow-400
            "
          >

            {running}

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

            Failed

          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-red-400
            "
          >

            {failed}

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

            Total Time

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

      </div>

      <div
        className="
          mt-6
          rounded-xl
          bg-[#09090B]
          p-4
        "
      >

        <p
          className="
            text-xs
            text-zinc-500
            mb-2
          "
        >

          Executive Summary

        </p>

        <p
          className="
            text-sm
            leading-7
            text-zinc-300
          "
        >

          {runtime.summary}

        </p>

      </div>

      <div
        className="
          mt-6
          rounded-xl
          bg-[#09090B]
          p-4
        "
      >

        <div
          className="
            flex
            justify-between
            text-sm
            mb-2
          "
        >

          <span>

            Average Step Time

          </span>

          <span
            className="
              font-semibold
              text-cyan-400
            "
          >

            {averageDuration.toFixed(2)} ms

          </span>

        </div>

        <div
          className="
            h-2
            rounded-full
            bg-zinc-800
            overflow-hidden
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-cyan-500
            "
            style={{

              width: `${progress}%`,

            }}
          />

        </div>

      </div>

    </div>

  );

}

export default RuntimeCard;