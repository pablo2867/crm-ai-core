"use client";

export default function LeadEmailResult({
  email,
}: {
  email: string;
}) {

  if (!email) {
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
          text-blue-700
          dark:text-blue-300
          mb-3
        "
      >
        📧 Email IA
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
        {email}
      </pre>

    </div>

  );

}
