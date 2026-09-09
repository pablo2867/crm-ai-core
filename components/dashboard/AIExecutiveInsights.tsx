import ExecuteRecommendationButton from "./ExecuteRecommendationButton";

import {
  executiveDashboardService,
} from "@/platform/services/executive";

interface Props {

  userId: string;

}

export default async function AIExecutiveInsights({

  userId,

}: Props) {

  const dashboard =
    await executiveDashboardService.get(
      userId
    );

  if (

    !dashboard.lead ||

    !dashboard.intelligence ||

    !dashboard.recommendations

  ) {

    return (

      <div
        className="
          mt-10
          bg-[#111113]
          border
          border-zinc-800
          rounded-3xl
          p-6
        "
      >

        <h2 className="text-2xl font-black">
          AI Executive Insights
        </h2>

        <p className="text-zinc-500 mt-4">
          No hay leads disponibles.
        </p>

      </div>

    );

  }

  const {

    lead,

    intelligence,

    recommendations,

  } = dashboard;

  const recommendation =

    intelligence.priority >= 90

      ? "Contactar inmediatamente."

      : intelligence.priority >= 70

      ? "Programar seguimiento hoy."

      : "Continuar nurturing.";

  return (

    <div
      className="
        mt-10
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
      "
    >

      <p className="text-zinc-500 text-sm">
        AI Executive Insights
      </p>

      <h2 className="text-3xl font-black mt-2">
        {lead.name}
      </h2>

      <p className="text-zinc-500 mt-1">
        {lead.company}
      </p>

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          mt-8
        "
      >

        <div>

          <p className="text-zinc-500 text-sm">
            Priority
          </p>

          <h3 className="text-2xl font-bold">
            {intelligence.priority}
          </h3>

        </div>

        <div>

          <p className="text-zinc-500 text-sm">
            Temperature
          </p>

          <h3 className="text-2xl font-bold">
            {intelligence.temperature}
          </h3>

        </div>

        <div>

          <p className="text-zinc-500 text-sm">
            Personality
          </p>

          <h3 className="text-2xl font-bold capitalize">
            {intelligence.personality}
          </h3>

        </div>

        <div>

          <p className="text-zinc-500 text-sm">
            Risk
          </p>

          <h3 className="text-2xl font-bold">
            {intelligence.risk}
          </h3>

        </div>

      </div>

      <div
        className="
          mt-8
          rounded-2xl
          bg-blue-500/10
          border
          border-blue-500/20
          p-5
        "
      >

        <p className="text-blue-400 font-bold">
          Recomendación IA
        </p>

        <p className="mt-2">
          {recommendation}
        </p>

      </div>

      <div
        className="
          mt-8
          rounded-2xl
          bg-[#18181B]
          border
          border-zinc-800
          p-5
        "
      >

        <h3 className="text-xl font-bold mb-4">
          Next Best Actions
        </h3>

        <div className="space-y-3">

          {recommendations.recommendations.length === 0 ? (

            <p className="text-zinc-500">
              No hay recomendaciones disponibles.
            </p>

          ) : (

            recommendations.recommendations.map(

              (item, index) => (

                <div
                  key={index}
                  className="
                    rounded-xl
                    bg-[#09090B]
                    border
                    border-zinc-800
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

                    <h4 className="font-bold">
                      {item.title}
                    </h4>

                    <span
                      className="
                        text-xs
                        bg-blue-500/20
                        text-blue-300
                        px-2
                        py-1
                        rounded-full
                      "
                    >
                      {item.priority}
                    </span>

                  </div>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-zinc-400
                    "
                  >
                    {item.description}
                  </p>

                  <p
                    className="
                      mt-3
                      text-xs
                      uppercase
                      text-zinc-500
                    "
                  >
                    Acción: {item.action}
                  </p>

                  <ExecuteRecommendationButton

                    action={item.action}

                    userId={userId}

                    leadId={lead.id}

                  />

                </div>

              )

            )

          )}

        </div>

      </div>

    </div>

  );

}
