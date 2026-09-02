import { getBricks } from "@/platform/registry";

export default function AutomationRules() {
  const bricks = getBricks();

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
        Registered Rules
      </h2>

      <p className="text-zinc-500 mb-6">
        Total Rules: {bricks.length}
      </p>

      <div className="space-y-3">
        {bricks.map((brick) => (
          <div
            key={brick.id}
            className="
              border
              border-zinc-700
              rounded-xl
              p-4
            "
          >
            <div className="font-bold">
              {brick.name}
            </div>

            <div className="text-sm text-zinc-500">
              {brick.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}