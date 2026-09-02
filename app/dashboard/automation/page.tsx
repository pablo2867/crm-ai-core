import { getMetrics } from "@/platform/automation/metrics";

import AutomationMetricCard from "@/components/automation/AutomationMetricCard";
import AutomationRules from "@/components/automation/AutomationRules";
import AutomationHistory from "@/components/automation/AutomationHistory";

export default function AutomationPage() {
  const metrics = getMetrics();

  return (
    <main className="p-8 space-y-8">

      <div>
        <h1 className="text-4xl font-black">
          Automation Center
        </h1>

        <p className="text-zinc-500">
          AI CORE Automation Engine
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        <AutomationMetricCard
          title="Executed"
          value={metrics.executed}
        />

        <AutomationMetricCard
          title="Success"
          value={metrics.success}
        />

        <AutomationMetricCard
          title="Errors"
          value={metrics.errors}
        />

        <AutomationMetricCard
          title="Average"
          value={`${metrics.averageDuration} ms`}
        />
      </div>

      <AutomationRules />

      <AutomationHistory />

    </main>
  );
}