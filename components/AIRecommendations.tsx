import type {
  Lead,
} from "@/platform/services/lead-service";

export default function AIRecommendations({
  leads = [],
}: {
  leads: Lead[];
}) {

  const recommendations = [];

  const topLeads = [...leads]

    .sort(
      (a, b) => {

        const potentialA =

          (a.ai_score || 0) *

          Number(
            a.estimated_revenue || 0
          );

        const potentialB =

          (b.ai_score || 0) *

          Number(
            b.estimated_revenue || 0
          );

        return (
          potentialB -
          potentialA
        );

      }
    )

    .slice(0, 5);

  const hotLead =
    leads.find(
      (lead) =>
        lead.ai_temperature === "HOT"
    );

  if (hotLead) {

    recommendations.push({

      type: "HOT",

      text:
        `${hotLead.name} tiene score ${hotLead.ai_score} y alta probabilidad de cierre.`,

    });

  }

  const newLead =
    leads.find(
      (lead) =>
        lead.status === "Nuevo"
    );

  if (newLead) {

    recommendations.push({

      type: "WARNING",

      text:
        `${newLead.name} sigue en estado Nuevo. Recomendamos contacto inmediato.`,

    });

  }

  const warmLead =
    leads.find(
      (lead) =>
        lead.ai_temperature === "WARM"
    );

  if (warmLead) {

    recommendations.push({

      type: "INFO",

      text:
        `${warmLead.name} mostró interés reciente y puede avanzar en el pipeline.`,

    });

  }

  const coldLead =
    leads.find(
      (lead) =>
        lead.ai_temperature === "COLD"
    );

  if (coldLead) {

    recommendations.push({

      type: "SUCCESS",

      text:
        `${coldLead.name} necesita reactivación con follow-up automático.`,

    });

  }

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

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          CRM AI
        </p>

        <h2
          className="
            text-3xl
            font-black
            text-white
            mt-2
          "
        >
          AI Recommendations
        </h2>

      </div>

      <div className="space-y-5">

        {recommendations.map(

          (
            recommendation,
            index
          ) => (

            <div
              key={index}
              className="
                bg-[#18181B]
                border
                border-zinc-800
                rounded-2xl
                p-5
                flex
                items-start
                gap-4
              "
            >

              <div className="text-2xl">

                {
                  recommendation.type === "HOT"
                    ? "🔥"
                  : recommendation.type === "WARNING"
                    ? "⚠️"
                  : recommendation.type === "SUCCESS"
                    ? "✅"
                  : "🤖"
                }

              </div>

              <p
                className="
                  text-zinc-300
                  leading-relaxed
                "
              >
                {recommendation.text}
              </p>

            </div>

          )

        )}

      </div>

      <div className="mt-10">

        <h3
          className="
            text-2xl
            font-black
            text-white
            mb-5
          "
        >
          🏆 Top 5 Oportunidades IA
        </h3>

        <div className="space-y-4">

          {topLeads.map(

            (
              lead,
              index
            ) => (

              <div
                key={lead.id}
                className="
                  bg-[#18181B]
                  border
                  border-zinc-800
                  rounded-2xl
                  p-4
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <p className="font-bold text-white">

                    #{index + 1} {lead.name}

                  </p>

                  <p className="text-zinc-400 text-sm">

                    Score: {lead.ai_score}

                  </p>

                  {Number(
                    lead.estimated_revenue || 0
                  ) > 0 ? (

                    <p className="text-emerald-400 text-sm font-semibold">

                      💰 $
                      {Number(
                        lead.estimated_revenue
                      ).toLocaleString()}

                    </p>

                  ) : (

                    <p className="text-yellow-400 text-sm font-semibold">

                      ⚠️ Sin revenue estimado

                    </p>

                  )}

                  <p className="text-cyan-400 text-xs mt-1">

                    Potencial IA:{" "}

                    {(
                      (lead.ai_score || 0) *
                      Number(
                        lead.estimated_revenue || 0
                      )
                    ).toLocaleString()}

                  </p>

                </div>

                <div
                  className="
                    text-emerald-400
                    font-bold
                  "
                >
                  {lead.ai_temperature}
                </div>

              </div>

            )

          )}

        </div>

      </div>

    </div>

  );

}
