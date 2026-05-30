type Lead = {
  id: number;
  name: string;
  ai_score: number;
  ai_temperature: string;
  status: string;
};

export default function AIRecommendations({
  leads = [],
}: {
  leads: Lead[];
}) {

  const recommendations = [];

  // HOT LEADS

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

  // LEADS EN NUEVO

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

  // LEADS WARM

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

  // LEADS COLD

  const coldLead =
    leads.find(
      (lead) =>
        lead.ai_temperature === "COLD"
    );

  if (coldLead) {

    recommendations.push({

      type: "SUCCESS",

      text:
        `${coldLead.name} necesita reactivación con followup automático.`,

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

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
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

        {

          recommendations.map(
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

                <div
                  className="
                    text-2xl
                  "
                >

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
          )

        }

      </div>

    </div>

  );

}