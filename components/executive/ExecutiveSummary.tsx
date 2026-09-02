import type {
  ExecutiveDashboardDTO,
} from "@/platform/executive";

interface Props {
  report: ExecutiveDashboardDTO | null;
}

function HealthMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        bg-[#18181B]
        border
        border-zinc-800
        rounded-2xl
        p-5
      "
    >
      <p className="text-zinc-500 text-sm">
        {label}
      </p>

      <h3
        className="
          text-3xl
          font-black
          mt-2
        "
      >
        {value}
      </h3>
    </div>
  );
}

export default function ExecutiveSummary({
  report,
}: Props) {

  if (!report) {
    return null;
  }

  return (

    <section
      className="
        mt-10
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-8
      "
    >

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          Executive Intelligence
        </p>

        <h2
          className="
            text-3xl
            font-black
            mt-2
          "
        >
          {report.summary.headline}
        </h2>

        <p className="mt-3 text-zinc-400">
          Estado:
          {" "}
          <span className="font-bold">
            {report.summary.status.toUpperCase()}
          </span>
        </p>

      </div>

      <div
        className="
          grid
          grid-cols-2
          xl:grid-cols-5
          gap-4
        "
      >

        <HealthMetric
          label="Overall"
          value={report.health.overall}
        />

        <HealthMetric
          label="Sales"
          value={report.health.sales}
        />

        <HealthMetric
          label="Pipeline"
          value={report.health.pipeline}
        />

        <HealthMetric
          label="AI"
          value={report.health.ai}
        />

        <HealthMetric
          label="Growth"
          value={report.health.growth}
        />

      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-8
          mt-10
        "
      >

        <div>

          <h3 className="font-bold mb-4">
            Riesgos
          </h3>

          <div className="space-y-3">

            {report.risks.length === 0 ? (

              <p className="text-zinc-500">
                Sin riesgos detectados.
              </p>

            ) : (

              report.risks.map((risk) => (

                <div
                  key={risk.title}
                  className="
                    rounded-xl
                    border
                    border-red-900/30
                    bg-red-500/10
                    p-4
                  "
                >
                  <p className="font-semibold">
                    {risk.title}
                  </p>

                  <p className="text-sm text-zinc-400 mt-2">
                    {risk.description}
                  </p>
                </div>

              ))

            )}

          </div>

        </div>

        <div>

          <h3 className="font-bold mb-4">
            Oportunidades
          </h3>

          <div className="space-y-3">

            {report.opportunities.length === 0 ? (

              <p className="text-zinc-500">
                Sin oportunidades.
              </p>

            ) : (

              report.opportunities.map((item) => (

                <div
                  key={item.title}
                  className="
                    rounded-xl
                    border
                    border-emerald-900/30
                    bg-emerald-500/10
                    p-4
                  "
                >
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-zinc-400 mt-2">
                    {item.description}
                  </p>
                </div>

              ))

            )}

          </div>

        </div>

        <div>

          <h3 className="font-bold mb-4">
            Recomendaciones IA
          </h3>

          <div className="space-y-3">

            {report.recommendations.length === 0 ? (

              <p className="text-zinc-500">
                Sin recomendaciones.
              </p>

            ) : (

              report.recommendations.map((item) => (

                <div
                  key={item.title}
                  className="
                    rounded-xl
                    border
                    border-blue-900/30
                    bg-blue-500/10
                    p-4
                  "
                >
                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-zinc-400 mt-2">
                    {item.description}
                  </p>
                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </section>

  );

}