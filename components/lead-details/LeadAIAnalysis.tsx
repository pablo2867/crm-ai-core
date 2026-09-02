"use client";

export default function LeadAIAnalysis({
  lead,
}: any) {

  return (

    <div
      className="
        bg-zinc-100
        dark:bg-zinc-900
        rounded-2xl
        p-4
      "
    >

      <p className="text-sm text-zinc-500 mb-2">
        AI Analysis
      </p>

      <p
        className="
          text-black
          dark:text-white
          leading-relaxed
        "
      >
        {lead.ai_analysis}
      </p>

    </div>

  );

}