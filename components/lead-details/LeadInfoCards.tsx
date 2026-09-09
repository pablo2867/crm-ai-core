"use client";

export default function LeadInfoCards({
  lead,
}: any) {

  return (

    <div
      className="
        mt-4
        grid
        grid-cols-2
        gap-3
      "
    >

      <div
        className="
          bg-zinc-100
          dark:bg-zinc-900
          rounded-xl
          p-3
        "
      >
        <p className="text-xs text-zinc-500">
          Email
        </p>

        <p className="font-medium break-all">
          {lead.email || "N/A"}
        </p>
      </div>

      <div
        className="
          bg-zinc-100
          dark:bg-zinc-900
          rounded-xl
          p-3
        "
      >
        <p className="text-xs text-zinc-500">
          Teléfono
        </p>

        <p className="font-medium">
          {lead.phone || "N/A"}
        </p>
      </div>

      <div
        className="
          bg-zinc-100
          dark:bg-zinc-900
          rounded-xl
          p-3
        "
      >
        <p className="text-xs text-zinc-500">
          Deal Value
        </p>

        <p className="font-medium text-emerald-500">
          $
          {Number(
            lead.deal_value || 0
          ).toLocaleString()}
        </p>
      </div>

      <div
        className="
          bg-zinc-100
          dark:bg-zinc-900
          rounded-xl
          p-3
        "
      >
        <p className="text-xs text-zinc-500">
          AI Temperature
        </p>

        <p className="font-medium">
          {lead.ai_temperature || "N/A"}
        </p>
      </div>

    </div>

  );

}
