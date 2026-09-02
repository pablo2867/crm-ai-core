export default function LeadCardAnalysis({
  lead,
}: any) {
  return (
    <>
      <div
        className="
          bg-zinc-100
          dark:bg-zinc-900
          rounded-2xl
          p-3
          min-h-[60px]
          flex items-center
        "
      >
        <p
          className="
            text-xs
            text-zinc-600
            dark:text-zinc-300
            line-clamp-2
          "
        >
          {lead.ai_analysis || "Sin análisis disponible"}
        </p>
      </div>

      {lead.ai_followup && (
        <div
          className="
            bg-blue-500/10
            border
            border-blue-500/20
            rounded-2xl
            p-3
          "
        >
          <p
            className="
              text-xs
              font-bold
              text-blue-600
              mb-1
            "
          >
            Follow-up IA
          </p>

          <p
            className="
              text-xs
              text-blue-700
              dark:text-blue-300
              leading-relaxed
              line-clamp-2
            "
          >
            {lead.ai_followup}
          </p>
        </div>
      )}

      {lead.close_probability && (
        <div
          className="
            bg-emerald-500/10
            border
            border-emerald-500/20
            rounded-2xl
            p-3
          "
        >
          <p
            className="
              text-xs
              font-bold
              text-emerald-400
              mb-1
            "
          >
            Probabilidad de Cierre
          </p>

          <p
            className="
              text-xs
              text-emerald-200
              leading-relaxed
            "
          >
            {lead.close_probability}%
          </p>
        </div>
      )}

      {lead.estimated_revenue && (
        <div
          className="
            bg-cyan-500/10
            border
            border-cyan-500/20
            rounded-2xl
            p-3
          "
        >
          <p
            className="
              text-xs
              font-bold
              text-cyan-400
              mb-1
            "
          >
            Revenue Estimado
          </p>

          <p
            className="
              text-xs
              text-cyan-200
              leading-relaxed
            "
          >
            $
            {Number(
              lead.estimated_revenue
            ).toLocaleString()}
          </p>
        </div>
      )}
    </>
  );
}