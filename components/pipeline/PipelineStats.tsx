export default function PipelineStats({
  hotLeads,
  remindersPending,
  avgScore,
  closedDeals,
}: any) {

  const hot =
    Number(hotLeads || 0);

  const reminders =
    Number(
      remindersPending || 0
    );

  const score =
    Number(avgScore || 0);

  const closed =
    Number(closedDeals || 0);

  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4

        gap-6

        mb-10
      "
    >

      <div
        className="
          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6
        "
      >

        <p className="text-zinc-500 text-sm">
          HOT Leads
        </p>

        <h2
          className="
            text-4xl
            font-black
            text-red-500
            mt-2
          "
        >
          🔥 {hot}
        </h2>

      </div>

      <div
        className="
          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6
        "
      >

        <p className="text-zinc-500 text-sm">
          Reminders
        </p>

        <h2
          className="
            text-4xl
            font-black
            text-yellow-500
            mt-2
          "
        >
          📅 {reminders}
        </h2>

      </div>

      <div
        className="
          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6
        "
      >

        <p className="text-zinc-500 text-sm">
          Score Promedio
        </p>

        <h2
          className="
            text-4xl
            font-black
            text-blue-500
            mt-2
          "
        >
          ⚡ {score}
        </h2>

      </div>

      <div
        className="
          bg-[#111113]

          border
          border-zinc-800

          rounded-3xl

          p-6
        "
      >

        <p className="text-zinc-500 text-sm">
          Cerrados
        </p>

        <h2
          className="
            text-4xl
            font-black
            text-green-500
            mt-2
          "
        >
          💰 {closed}
        </h2>

      </div>

    </div>

  );

}
