"use client";

interface Props {
  data: any;
}

export default function AIOpportunityRadar({
  data,
}: Props) {

  const bestLead =
    typeof data?.bestLead === "object" &&
    data?.bestLead !== null
      ? data.bestLead.name ?? "Sin datos"
      : data?.bestLead ?? "Sin datos";

  const score =
    data?.bestLead?.ai_score ??
    data?.score ??
    0;

  const probability =
    data?.bestLead?.close_probability ??
    data?.probability ??
    0;

  const revenue =
    data?.bestLead?.estimated_revenue ??
    data?.revenue ??
    0;

  const riskLeads =
    data?.riskLeads || 0;

  function openLeadDetails() {

    alert(`
Lead: ${bestLead}

AI Score: ${score}

Probabilidad de cierre: ${probability}%

Revenue Potencial: $${revenue.toLocaleString()}
`);

  }

  return (

    <div
      className="
        bg-[#111113]
        border
        border-orange-500/20
        rounded-3xl
        p-6
        mb-8
      "
    >

      <p className="text-orange-400 text-sm">
        AI Opportunity Radar
      </p>

      <h2 className="text-2xl font-black mt-3">
        Radar de Oportunidades
      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          gap-4
          mt-6
        "
      >

        <div
          className="
            bg-black/30
            rounded-2xl
            p-5
          "
        >

          <p className="text-zinc-400">
            ðŸ”¥ Mejor Oportunidad
          </p>

          <button
            onClick={
              openLeadDetails
            }
            className="
              text-2xl
              font-bold
              mt-2
              text-left
              hover:text-orange-400
              transition
              cursor-pointer
            "
          >
            {bestLead}
          </button>

          <p className="mt-2 text-zinc-300">
            AI Score: {score}
          </p>

          <p className="text-zinc-300">
            Probabilidad: {probability}%
          </p>

          <p className="text-zinc-300">
            Revenue: $
            {revenue.toLocaleString()}
          </p>

        </div>

        <div
          className="
            bg-black/30
            rounded-2xl
            p-5
          "
        >

          <p className="text-zinc-400">
            âš  Leads en Riesgo
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {riskLeads}
          </h3>

          <p className="mt-2 text-zinc-300">
            Leads clasificados
            como COLD.
          </p>

        </div>

      </div>

    </div>

  );

}
