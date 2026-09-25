"use client";

import type {
  WorkflowCardProps,
} from "./types";

export function WorkflowCard({
  workflow,
}: WorkflowCardProps) {

  if (!workflow) {
    return null;
  }

  const execution =
    workflow.execution ?? [];

  const successfulSteps =
    execution.filter(
      (step) => step.success
    ).length;

  const failedSteps =
    execution.filter(
      (step) => !step.success
    ).length;

  const completed =
    workflow.success === true;

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
        Workflow Execution
      </h3>

      <div
        className="
          grid
          grid-cols-1 sm:grid-cols-2
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
            Status
          </p>

          <p
            className={`
              mt-2
              text-lg
              font-semibold
              ${
                completed
                  ? "text-emerald-400"
                  : "text-red-400"
              }
            `}
          >
            {
              completed
                ? "Completed"
                : "Failed"
            }
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
            Duration
          </p>

          <p
            className="
              mt-2
              text-lg
              font-semibold
              text-cyan-400
            "
          >
            {workflow.totalDurationMs ?? 0} ms
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
            Successful Steps
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-emerald-400
            "
          >
            {successfulSteps}
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
            Failed Steps
          </p>

          <p
            className="
              mt-2
              text-2xl
              font-bold
              text-red-400
            "
          >
            {failedSteps}
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
          Execution Timeline
        </h4>

        <div className="space-y-2">

          {
            execution.map((step, index) => (

              <div
                key={`${step.skill ?? step.capability ?? "step"}-${index}`}
                className="
                  rounded-xl
                  bg-[#09090B]
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >

                  <span>
                    {step.skill ?? step.capability ?? "Step"}
                  </span>

                  <span
                    className={
                      step.success
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {
                      step.success
                        ? "OK"
                        : "ERROR"
                    }
                  </span>

                </div>

                {
                  !step.success &&
                  step.message && (
                    <p
                      className="
                        mt-2
                        text-xs
                        text-red-300
                        break-words
                      "
                    >
                      {step.message}
                    </p>
                  )
                }

              </div>

            ))
          }

        </div>

      </div>

    </div>

  );
}

export default WorkflowCard;

