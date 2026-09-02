"use client";

import type {
  TimelineCardProps,
} from "./types";

function getStatusColor(
  status: string
) {

  switch (status) {

    case "completed":

      return "text-emerald-400";

    case "running":

      return "text-yellow-400";

    case "failed":

      return "text-red-400";

    default:

      return "text-zinc-500";

  }

}

function getStatusLabel(
  status: string
) {

  switch (status) {

    case "completed":

      return "Completed";

    case "running":

      return "Running";

    case "failed":

      return "Failed";

    default:

      return "Pending";

  }

}

export function TimelineCard({

  runtime,

}: TimelineCardProps) {

  if (!runtime) {

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

            Execution Timeline

          </h3>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >

            Ejecución del Runtime

          </p>

        </div>

        <div
          className="
            text-right
          "
        >

          <div
            className="
              text-2xl
              font-bold
              text-cyan-400
            "
          >

            {runtime.steps.length}

          </div>

          <div
            className="
              text-xs
              text-zinc-500
            "
          >

            Steps

          </div>

        </div>

      </div>

      {

        runtime.steps.length === 0 && (

          <div
            className="
              rounded-xl
              bg-[#09090B]
              p-4
              text-zinc-500
            "
          >

            No hay pasos registrados.

          </div>

        )

      }

      <div className="space-y-3">

        {

          runtime.steps.map((step) => (

            <div

              key={step.id}

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

                <div>

                  <h4
                    className="
                      font-semibold
                    "
                  >

                    {step.name}

                  </h4>

                </div>

                <span
                  className={`
                    text-sm
                    font-semibold
                    ${getStatusColor(step.status)}
                  `}
                >

                  {getStatusLabel(step.status)}

                </span>

              </div>

            </div>

          ))

        }

      </div>

    </div>

  );

}

export default TimelineCard;
