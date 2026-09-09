"use client";

import type {
  AIHealthReport,
} from "@/platform/ai-health";

interface HealthCardProps {

  health: AIHealthReport | null;

}

export function HealthCard({

  health,

}: HealthCardProps) {

  if (!health) {

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

          AI Health

        </h3>

        <p
          className="
            mt-4
            text-zinc-500
          "
        >

          No hay información disponible.

        </p>

      </div>

    );

  }

  const color =

    health.overallScore >= 90

      ? "text-emerald-400"

      : health.overallScore >= 70

        ? "text-amber-400"

        : "text-red-400";

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

            AI Health

          </h3>

          <p
            className="
              text-sm
              text-zinc-500
            "
          >

            Estado general de la plataforma

          </p>

        </div>

        <div className="text-right">

          <div
            className={`
              text-4xl
              font-bold
              ${color}
            `}
          >

            {health.overallScore}

          </div>

          <div
            className="
              text-xs
              uppercase
              text-zinc-500
            "
          >

            {health.overallStatus}

          </div>

        </div>

      </div>

      <div
        className="
          grid
          gap-4
        "
      >

        {

          health.components.map(

            (component) => {

              const componentColor =

                component.score >= 90

                  ? "text-emerald-400"

                  : component.score >= 70

                    ? "text-amber-400"

                    : "text-red-400";

              return (

                <div

                  key={component.id}

                  className="
                    rounded-xl
                    bg-[#09090B]
                    p-4
                  "

                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                    "
                  >

                    <div>

                      <h4
                        className="
                          font-semibold
                        "
                      >

                        {component.name}

                      </h4>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-zinc-400
                        "
                      >

                        {component.message}

                      </p>

                    </div>

                    <div
                      className={`
                        text-2xl
                        font-bold
                        ${componentColor}
                      `}
                    >

                      {component.score}

                    </div>

                  </div>

                  {

                    component.recommendation && (

                      <div
                        className="
                          mt-4
                          rounded-lg
                          border
                          border-emerald-900
                          bg-emerald-950/30
                          p-3
                        "
                      >

                        <p
                          className="
                            text-xs
                            text-emerald-300
                          "
                        >

                          {component.recommendation}

                        </p>

                      </div>

                    )

                  }

                </div>

              );

            }

          )

        }

      </div>

    </div>

  );

}

export default HealthCard;
