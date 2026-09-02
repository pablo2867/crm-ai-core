"use client";

import type {
  DecisionCardProps,
} from "./types";

export function DecisionCard({

  decision,

}: DecisionCardProps) {

  if (!decision) {

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
            text-sm
            font-semibold
            text-zinc-300
          "
        >

          Executive Decision

        </h3>

        <p
          className="
            mt-4
            text-sm
            text-zinc-500
          "
        >

          No hay decisiones disponibles.

        </p>

      </div>

    );

  }

  const confidence =
    Math.round(
      decision.confidence * 100
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

      <h3
        className="
          text-lg
          font-semibold
          mb-6
        "
      >

        Executive Decision

      </h3>

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
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

            Workflow

          </p>

          <p
            className="
              mt-2
              text-emerald-400
              font-semibold
            "
          >

            {decision.workflow.name}

          </p>

          <p
            className="
              mt-1
              text-xs
              text-zinc-500
            "
          >

            {decision.workflowId}

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

            Capability

          </p>

          <p
            className="
              mt-2
              font-medium
            "
          >

            {decision.capabilityId ?? "General"}

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

            Confidence

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-cyan-400
            "
          >

            {confidence}%

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

            Decision Score

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-amber-400
            "
          >

            {decision.selectedScore}

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

        <p className="text-xs text-zinc-500">

          Executive Summary

        </p>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-zinc-300
          "
        >

          {decision.reason}

        </p>

      </div>

      <div className="mt-6">

        <p
          className="
            text-xs
            text-zinc-500
            mb-3
          "
        >

          Workflow Ranking

        </p>

        <div className="space-y-2">

          {decision.ranking.map((item) => (

            <div

              key={item.workflow.id}

              className="
                flex
                items-center
                justify-between
                rounded-xl
                bg-[#09090B]
                px-4
                py-3
              "

            >

              <span>

                {item.workflow.name}

              </span>

              <span
                className="
                  font-bold
                  text-emerald-400
                "
              >

                {item.score}

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default DecisionCard;