import { getHistory } from "@/platform/automation/history";

export default function AutomationHistory() {
  const history = getHistory();

  return (
    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        p-6
      "
    >
      <h2 className="text-xl font-bold mb-4">
        Execution History
      </h2>

      {history.length === 0 ? (
        <p className="text-zinc-500">
          No automation executed yet.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="
                border
                border-zinc-700
                rounded-xl
                p-4
              "
            >
              <div className="font-bold">
                {item.rule}
              </div>

              <div className="text-sm text-zinc-500">
                {item.event}
              </div>

              <div className="text-xs mt-2">
                {item.status}
              </div>

              <div className="text-xs">
                {item.duration} ms
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}