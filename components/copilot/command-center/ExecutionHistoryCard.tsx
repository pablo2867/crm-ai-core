import type {
  RuntimeHistoryEntry,
  RuntimeHistoryStats,
} from "@/platform/runtime/history";

interface ExecutionHistoryCardProps {

  history: RuntimeHistoryEntry[];

  stats: RuntimeHistoryStats | null;

}

export function ExecutionHistoryCard({

  history,

  stats,

}: ExecutionHistoryCardProps) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#18181B]
        p-5
      "
    >

      <h3
        className="
          text-sm
          font-semibold
          text-zinc-300
        "
      >
        Runtime History
      </h3>

      <div className="mt-5 space-y-5">

        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >

          <div>

            <p className="text-xs text-zinc-500">
              Ejecuciones
            </p>

            <p className="text-white">
              {stats?.totalExecutions ?? 0}
            </p>

          </div>

          <div>

            <p className="text-xs text-zinc-500">
              Promedio
            </p>

            <p className="text-cyan-400">
              {(stats?.averageDuration ?? 0).toFixed(2)} ms
            </p>

          </div>

        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >

          <div>

            <p className="text-xs text-zinc-500">
              Correctas
            </p>

            <p className="text-green-400">
              {stats?.successfulExecutions ?? 0}
            </p>

          </div>

          <div>

            <p className="text-xs text-zinc-500">
              Fallidas
            </p>

            <p className="text-red-400">
              {stats?.failedExecutions ?? 0}
            </p>

          </div>

        </div>

        <div>

          <p className="text-xs text-zinc-500 mb-3">
            Últimas ejecuciones
          </p>

          <div className="space-y-3">

            {history.length === 0 && (

              <p className="text-sm text-zinc-500">
                No hay ejecuciones registradas.
              </p>

            )}

            {history.slice(0, 5).map((item) => (

              <div

                key={item.id}

                className="
                  rounded-xl
                  border
                  border-zinc-700
                  p-3
                "

              >

                <div
                  className="
                    flex
                    justify-between
                    items-center
                  "
                >

                  <span className="text-sm font-medium">

                    {item.workflow ?? "Runtime"}

                  </span>

                  <span

                    className={
                      item.success
                        ? "text-green-400 text-xs"
                        : "text-red-400 text-xs"
                    }

                  >

                    {item.success
                      ? "Success"
                      : "Error"}

                  </span>

                </div>

                <p className="text-xs text-zinc-400 mt-2">

                  {item.summary}

                </p>

                <div
                  className="
                    flex
                    justify-between
                    mt-3
                    text-xs
                    text-zinc-500
                  "
                >

                  <span>

                    {new Date(
                      item.createdAt
                    ).toLocaleTimeString()}

                  </span>

                  <span>

                    {item.duration.toFixed(2)} ms

                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}

export default ExecutionHistoryCard;
