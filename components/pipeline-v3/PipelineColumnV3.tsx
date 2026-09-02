"use client";

import { useDroppable } from "@dnd-kit/core";

import {
  pipelineIntelligenceEngine,
} from "@/platform/pipeline-intelligence";

import PipelineCardV3 from "./PipelineCardV3";

interface Props {
  title: string;
  leads: any[];
}

export default function PipelineColumnV3({
  title,
  leads,
}: Props) {
  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: title,
  });

  const totalRevenue = leads.reduce(
    (
      total: number,
      lead: any
    ) =>
      total +
      Number(
        lead.estimated_revenue ||
          lead.deal_value ||
          0
      ),
    0
  );

  const intelligence =
    pipelineIntelligenceEngine.analyze({
      leads,
    });

  const headerColor =
    title === "new"
      ? "from-blue-500/20 to-blue-600/5"
      : title === "contacted"
      ? "from-yellow-500/20 to-yellow-600/5"
      : title === "qualified"
      ? "from-cyan-500/20 to-cyan-600/5"
      : title === "proposal"
      ? "from-purple-500/20 to-purple-600/5"
      : title === "negotiation"
      ? "from-orange-500/20 to-orange-600/5"
      : title === "closed_won"
      ? "from-emerald-500/20 to-emerald-600/5"
      : "from-red-500/20 to-red-600/5";

  const displayTitle =
    {
      new: "Nuevo",
      contacted: "Contactado",
      qualified: "Calificado",
      proposal: "Propuesta",
      negotiation: "Negociación",
      closed_won: "Ganado",
      closed_lost: "Perdido",
    }[title] || title;

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-3xl
        min-h-[700px]
        border
        transition-all
        duration-300
        overflow-hidden

        ${
          isOver
            ? `
              border-cyan-500
              bg-cyan-500/10
              shadow-xl
              shadow-cyan-500/20
            `
            : `
              border-zinc-800
              bg-[#111113]
            `
        }
      `}
    >
      <div
        className={`
          bg-gradient-to-r
          ${headerColor}
          p-5
          border-b
          border-zinc-800
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2
            className="
              text-xl
              font-bold
              text-white
            "
          >
            {displayTitle}
          </h2>

          <span
            className="
              px-3
              py-1
              rounded-full
              bg-zinc-900
              text-xs
              font-semibold
              text-zinc-300
            "
          >
            {leads.length}
          </span>
        </div>

        <div className="mt-4">
          <div
            className="
              text-xs
              uppercase
              tracking-wider
              text-zinc-500
            "
          >
            Revenue
          </div>

          <div
            className="
              mt-1
              text-3xl
              font-bold
              text-emerald-400
            "
          >
            $
            {totalRevenue.toLocaleString()}
          </div>

          <div
            className="
              mt-5
              grid
              grid-cols-2
              gap-3
              text-sm
            "
          >
            <div>
              <div className="text-zinc-500">
                AI Score
              </div>

              <div className="font-semibold text-white">
                {intelligence.avgScore}
              </div>
            </div>

            <div>
              <div className="text-zinc-500">
                Probabilidad
              </div>

              <div className="font-semibold text-cyan-400">
                {intelligence.avgProbability}%
              </div>
            </div>

            <div>
              <div className="text-zinc-500">
                Prioridad
              </div>

              <div className="font-semibold text-orange-400">
                {intelligence.priority}
              </div>
            </div>

            <div>
              <div className="text-zinc-500">
                Riesgo
              </div>

              <div className="font-semibold text-red-400">
                {intelligence.risk}
              </div>
            </div>
          </div>

          <div
            className="
              mt-5
              rounded-xl
              border
              border-cyan-500/20
              bg-cyan-500/5
              p-3
              text-xs
              text-cyan-200
            "
          >
            🤖 {intelligence.recommendation}
          </div>
        </div>
      </div>

      <div
        className="
          p-5
          space-y-4
        "
      >
        {leads.length === 0 && (
          <div
            className="
              py-20
              text-center
              text-zinc-500
            "
          >
            Sin leads
          </div>
        )}

        {leads.map((lead: any) => (
          <PipelineCardV3
            key={lead.id}
            lead={lead}
          />
        ))}
      </div>
    </div>
  );
}