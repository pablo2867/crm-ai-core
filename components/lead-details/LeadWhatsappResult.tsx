"use client";

export default function LeadWhatsappResult({
  whatsapp,
}: {
  whatsapp: string;
}) {

  if (!whatsapp) {
    return null;
  }

  return (

    <div
      className="
        bg-green-500/10
        border
        border-green-500/20
        rounded-2xl
        p-4
      "
    >

      <p
        className="
          text-sm
          font-bold
          text-green-700
          dark:text-green-300
          mb-3
        "
      >
        💬 WhatsApp IA
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
        {whatsapp}
      </pre>

    </div>

  );

}
