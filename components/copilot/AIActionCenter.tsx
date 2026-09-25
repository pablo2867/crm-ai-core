"use client";

interface Props {
  data: any;
}

export default function AIActionCenter({
  data,
}: Props) {

  const bestLead =
    typeof data?.bestLead === "object" && data?.bestLead !== null
      ? data.bestLead.name || "Sin datos"
      : data?.bestLead || "Sin datos";

  const probability =
    data?.probability || 0;

  const revenue =
    data?.revenue || 0;

  return (

    <div
      className="
        bg-gradient-to-br
        from-green-500/10
        to-emerald-500/10
        border
        border-green-500/20
        rounded-3xl
        p-6
        mb-8
      "
    >

      <p className="text-green-400 text-sm">
        AI Action Center
      </p>

      <h2 className="text-2xl font-black mt-3">
        Acci�n Recomendada
      </h2>

      <div className="mt-6">

        <div
          className="
            bg-black/30
            rounded-2xl
            p-5
          "
        >

          <p className="text-zinc-400">
            ?? Lead Prioritario
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {bestLead}
          </h3>

          <p className="mt-3 text-zinc-300">
            Probabilidad de cierre:
            {" "}
            {probability}%
          </p>

          <p className="text-zinc-300">
            Revenue potencial:
            {" "}
            $
            {revenue.toLocaleString()}
          </p>

          <div
            className="
              mt-4
              p-4
              rounded-xl
              bg-green-500/10
              border
              border-green-500/20
            "
          >

            <p className="text-green-300">
              Contactar hoy a este lead.
              Es la oportunidad con
              mayor probabilidad de cierre
              dentro del pipeline.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}
