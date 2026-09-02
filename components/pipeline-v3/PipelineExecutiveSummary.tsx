"use client";

import {
  pipelineIntelligenceEngine,
} from "@/platform/pipeline-intelligence";

interface Props {
  columns: Array<{
    title: string;
    leads: any[];
  }>;

  onCreateTasks: () => Promise<void>;
}

export default function PipelineExecutiveSummary({
  columns,
  onCreateTasks,
}: Props) {
  const allLeads = columns.flatMap(
    (column) => column.leads
  );

  const intelligence =
    pipelineIntelligenceEngine.analyze({
      leads: allLeads,
    });

  return (
    <div
      className="
        mb-8
        rounded-3xl
        border
        border-cyan-500/20
        bg-gradient-to-r
        from-cyan-500/10
        to-blue-500/5
        p-6
      "
    >
      <div className="flex items-center justify-between">
        <h2
          className="
            text-2xl
            font-bold
            text-white
          "
        >
          🤖 Executive Pipeline Summary
        </h2>

        <div
          className="
            rounded-full
            bg-cyan-500/20
            px-4
            py-2
            text-sm
            font-semibold
            text-cyan-300
          "
        >
          {allLeads.length} Leads
        </div>
      </div>

      <div
        className="
          mt-6
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        <div>
          <div className="text-zinc-500">
            Pipeline Value
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-emerald-400
            "
          >
            ${intelligence.revenue.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">
            AI Score
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            {intelligence.avgScore}
          </div>
        </div>

        <div>
          <div className="text-zinc-500">
            Probabilidad
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-cyan-400
            "
          >
            {intelligence.avgProbability}%
          </div>
        </div>

        <div>
          <div className="text-zinc-500">
            Prioridad
          </div>

          <div
            className="
              text-2xl
              font-bold
              text-orange-400
            "
          >
            {intelligence.priority}
          </div>
        </div>
      </div>

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-cyan-500/20
          bg-cyan-500/5
          p-4
        "
      >
        <div className="text-cyan-200">
          <strong>IA recomienda:</strong>{" "}
          {intelligence.recommendation}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void onCreateTasks()}
            className="
              rounded-xl
              bg-cyan-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-cyan-500
            "
          >
            ✓ Crear tareas
          </button>

          <button
            type="button"
            className="
              rounded-xl
              bg-emerald-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-emerald-500
            "
          >
            ✉ Generar Follow-up
          </button>

          <button
            type="button"
            className="
              rounded-xl
              bg-green-700
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition-colors
              hover:bg-green-600
            "
          >
            📱 WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}