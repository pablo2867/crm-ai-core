"use client";

export default function LeadFollowup({
  lead,
}: any) {

  if (!lead.ai_followup) {
    return null;
  }

  return (

    <div
      className="
        bg-blue-500/10
        border
        border-blue-500/20
        rounded-2xl
        p-4
      "
    >

      <p
        className="
          text-sm
          font-bold
          text-blue-600
          mb-2
        "
      >
        Follow-up IA
      </p>

      <p
        className="
          text-sm
          text-blue-700
          dark:text-blue-300
          leading-relaxed
        "
      >
        {lead.ai_followup}
      </p>

    </div>

  );

}