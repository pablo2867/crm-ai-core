"use client";

export default function LeadCoachResult({
  coach,
}: {
  coach: string;
}) {

  if (!coach) {
    return null;
  }

  return (

    <div
      className="
        bg-purple-500/10
        border
        border-purple-500/20
        rounded-2xl
        p-4
      "
    >

      <p
        className="
          text-sm
          font-bold
          text-purple-700
          dark:text-purple-300
          mb-3
        "
      >
        🎯 Deal Coach IA
      </p>

      <pre
        className="
          whitespace-pre-wrap
          text-sm
          text-black
          dark:text-white
          leading-relaxed
          font-sans
        "
      >
        {coach}
      </pre>

    </div>

  );

}