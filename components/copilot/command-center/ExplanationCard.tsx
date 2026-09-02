"use client";

import type {
  DecisionExplanation,
} from "@/platform/decision/explanation";

interface ExplanationCardProps {

  explanation: DecisionExplanation | null;

}

export function ExplanationCard({

  explanation,

}: ExplanationCardProps) {

  if (!explanation) {

    return null;

  }

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

        Executive Brief

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
              font-semibold
              text-emerald-400
            "
          >

            {explanation.workflowName}

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

            AI Confidence

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-cyan-400
            "
          >

            {(explanation.confidence * 100).toFixed(0)}%

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

            Final Score

          </p>

          <p
            className="
              mt-2
              text-3xl
              font-bold
              text-amber-400
            "
          >

            {explanation.finalScore}

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

            Decision

          </p>

          <p
            className="
              mt-2
              text-sm
              leading-6
            "
          >

            {explanation.summary}

          </p>

        </div>

      </div>

      <div className="mt-6">

        <h4
          className="
            text-sm
            font-semibold
            mb-4
          "
        >

          Decision Factors

        </h4>

        <div className="space-y-3">

          {

            explanation.reasons.length === 0 && (

              <div
                className="
                  rounded-xl
                  bg-[#09090B]
                  p-4
                  text-zinc-500
                "
              >

                No existen factores registrados.

              </div>

            )

          }

          {

            explanation.reasons.map(

              (reason, index) => (

                <div

                  key={`${reason.title}-${index}`}

                  className="
                    rounded-xl
                    bg-[#09090B]
                    p-4
                  "

                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        font-medium
                      "
                    >

                      {reason.title}

                    </span>

                    <span
                      className="
                        text-cyan-400
                        font-bold
                      "
                    >

                      {reason.weight}

                    </span>

                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-zinc-400
                      leading-6
                    "
                  >

                    {reason.description}

                  </p>

                </div>

              )

            )

          }

        </div>

      </div>

    </div>

  );

}

export default ExplanationCard;