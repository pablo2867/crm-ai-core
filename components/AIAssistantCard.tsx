"use client";

import {
  Sparkles,
  BrainCircuit,
  Flame,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

export default function AIAssistantCard({
  totalLeads,
  hotLeads,
  warmLeads,
}: {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
}) {

  const conversionProbability =
    totalLeads > 0
      ? Math.round(
          (
            (
              hotLeads * 0.8 +
              warmLeads * 0.4
            ) /
            totalLeads
          ) * 100
        )
      : 0;

  return (

    <div
      className="
        rounded-3xl
        bg-gradient-to-br
        from-blue-600
        via-purple-600
        to-fuchsia-600
        p-6
        shadow-2xl
        relative
        overflow-hidden
      "
    >

      <div className="absolute top-0 right-0 opacity-10">

        <BrainCircuit size={180} />

      </div>

      <div className="relative z-10">

        <div className="flex items-center gap-3 mb-5">

          <div
            className="
              w-14 h-14
              rounded-2xl
              bg-white/20
              backdrop-blur-md
              flex items-center justify-center
            "
          >

            <Sparkles
              size={28}
              className="text-white"
            />

          </div>

          <div>

            <p className="text-white/70 text-sm">
              AI Assistant
            </p>

            <h2 className="text-2xl font-black text-white">
              CRM Intelligence
            </h2>

          </div>

        </div>

        <p className="text-white/80 leading-relaxed">
          La IA está monitoreando leads,
          detectando oportunidades y
          analizando intención de compra
          en tiempo real.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6">

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">

            <div className="flex items-center gap-3">

              <Flame className="text-red-300" />

              <div>

                <p className="text-white/70 text-sm">
                  Leads calientes detectados
                </p>

                <h3 className="text-3xl font-black text-white">
                  {hotLeads}
                </h3>

              </div>

            </div>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">

            <div className="flex items-center gap-3">

              <TrendingUp className="text-green-300" />

              <div>

                <p className="text-white/70 text-sm">
                  Probabilidad de conversión
                </p>

                <h3 className="text-3xl font-black text-white">
                  {conversionProbability}%
                </h3>

              </div>

            </div>

          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">

            <div className="flex items-center gap-3">

              <MessageSquare className="text-cyan-300" />

              <div>

                <p className="text-white/70 text-sm">
                  Insight IA
                </p>

                <h3 className="text-lg font-bold text-white leading-snug mt-1">

                  {
                    hotLeads > 0
                      ? `La IA detectó ${hotLeads} oportunidades prioritarias listas para seguimiento.`
                      : "La IA recomienda analizar más leads para detectar oportunidades."
                  }

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}