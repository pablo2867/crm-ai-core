export default function LeadCardBadges({
  lead,
}: any) {
  const score = Number(
    lead.ai_score || 0
  );

  const scoreIcon =
    score >= 85
      ? "🔥"
      : score >= 70
      ? "⚡"
      : "❄️";

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className="
          px-3 py-1
          rounded-full
          bg-yellow-500/20
          text-yellow-600
          text-xs
          font-semibold
        "
      >
        {lead.status}
      </span>

      <span
        className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold
          ${
            score >= 85
              ? "bg-red-500/20 text-red-500"
              : score >= 70
              ? "bg-yellow-500/20 text-yellow-600"
              : "bg-blue-500/20 text-blue-500"
          }
        `}
      >
        {scoreIcon} {score}
      </span>

      <span
        className={`
          px-3 py-1
          rounded-full
          text-xs
          font-semibold
          ${
            lead.ai_temperature === "HOT"
              ? "bg-red-500/20 text-red-500"
              : lead.ai_temperature === "WARM"
              ? "bg-yellow-500/20 text-yellow-600"
              : "bg-blue-500/20 text-blue-500"
          }
        `}
      >
        {lead.ai_temperature === "HOT"
          ? "🔥 HOT"
          : lead.ai_temperature === "WARM"
          ? "⚡ WARM"
          : "❄️ COLD"}
      </span>
    </div>
  );
}