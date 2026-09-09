"use client";

interface Props {
  forecastRevenue?: number;
  hotLeads?: number;
  conversionRate?: number;
}

export default function CopilotInsights({
  forecastRevenue = 0,
  hotLeads = 0,
  conversionRate = 0,
}: Props) {

  const pipelineHealth =
    conversionRate >= 61
      ? "SALUDABLE"
      : conversionRate >= 31
      ? "ESTABLE"
      : "CRÍTICO";

  const pipelineColor =
    conversionRate >= 61
      ? "text-emerald-400"
      : conversionRate >= 31
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
        mb-8
      "
    >
      <div
        className="
          bg-emerald-500/10
          border
          border-emerald-500/20
          rounded-3xl
          p-6
        "
      >
        <p className="text-emerald-400 text-sm">
          Revenue Forecast
        </p>

        <h3 className="text-3xl font-black mt-3">
          $
          {forecastRevenue.toLocaleString()}
        </h3>

        <p className="text-zinc-400 mt-2">
          Forecast estimado del pipeline.
        </p>
      </div>

      <div
        className="
          bg-red-500/10
          border
          border-red-500/20
          rounded-3xl
          p-6
        "
      >
        <p className="text-red-400 text-sm">
          HOT Leads
        </p>

        <h3 className="text-3xl font-black mt-3">
          {hotLeads}
        </h3>

        <p className="text-zinc-400 mt-2">
          Leads prioritarios para cierre.
        </p>
      </div>

      <div
        className="
          bg-blue-500/10
          border
          border-blue-500/20
          rounded-3xl
          p-6
        "
      >
        <p className="text-blue-400 text-sm">
          Conversion Rate
        </p>

        <h3 className="text-3xl font-black mt-3">
          {conversionRate}%
        </h3>

        <p className="text-zinc-400 mt-2">
          Rendimiento actual del pipeline.
        </p>
      </div>

      <div
        className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-3xl
          p-6
        "
      >
        <p className="text-zinc-400 text-sm">
          Pipeline Health
        </p>

        <h3
          className={`
            text-3xl
            font-black
            mt-3
            ${pipelineColor}
          `}
        >
          {pipelineHealth}
        </h3>

        <p className="text-zinc-400 mt-2">
          Estado general del pipeline.
        </p>
      </div>
    </div>
  );
}
