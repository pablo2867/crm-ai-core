"use client";

interface PipelineChartProps {
  filtered: any[];
}

export default function PipelineChart({
  filtered,
}: PipelineChartProps) {
  return (
    <div
      className="
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
        mb-10
      "
    >
      <h2 className="text-white font-bold">
        Chart desactivado temporalmente
      </h2>

      <p className="text-zinc-400 mt-2 text-sm">
        Leads analizados: {filtered.length}
      </p>
    </div>
  );
}