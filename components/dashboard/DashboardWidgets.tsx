import { executiveService } from "@/platform/executive/service";

import type {
  ExecutiveRecommendation,
  ExecutiveRisk,
} from "@/platform/executive/dto";

interface DashboardWidgetsProps {
  userId: string;
}

export default async function DashboardWidgets({
  userId,
}: DashboardWidgetsProps) {

  const result =
    await executiveService.get(userId);

  const report =
    result.report;

  return (

    <div className="space-y-6">

      {/* Business Health */}

      <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">

        <p className="text-zinc-500 text-sm">
          Business Health
        </p>

        <h2 className="text-5xl font-black mt-3">
          {report.health.overall}
        </h2>

        <p className="text-green-400 mt-2">
          Business Score
        </p>

      </div>

      {/* Riesgos */}

      <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">

        <h3 className="text-xl font-bold">
          Riesgos
        </h3>

        <div className="mt-4 space-y-4">

          {report.risks.length === 0 ? (

            <p className="text-zinc-500">
              No hay riesgos detectados.
            </p>

          ) : (

            report.risks.map(

              (
                item: ExecutiveRisk,
                index: number
              ) => (

                <div
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-[#09090B] p-4"
                >

                  <p className="font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-zinc-400 mt-2">
                    {item.description}
                  </p>

                  <span className="inline-block mt-3 rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
                    {item.severity}
                  </span>

                </div>

              )

            )

          )}

        </div>

      </div>

      {/* Recomendaciones */}

      <div className="rounded-2xl border border-zinc-800 bg-[#111113] p-6">

        <h3 className="text-xl font-bold">
          Recomendaciones IA
        </h3>

        <div className="mt-4 space-y-4">

          {report.recommendations.length === 0 ? (

            <p className="text-zinc-500">
              No hay recomendaciones.
            </p>

          ) : (

            report.recommendations.map(

              (
                item: ExecutiveRecommendation,
                index: number
              ) => (

                <div
                  key={index}
                  className="rounded-xl border border-zinc-800 bg-[#09090B] p-4"
                >

                  <div className="flex items-center justify-between">

                    <p className="font-semibold">
                      {item.title}
                    </p>

                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                      {item.priority}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-zinc-400">
                    {item.description}
                  </p>

                </div>

              )

            )

          )}

        </div>

      </div>

    </div>

  );

}