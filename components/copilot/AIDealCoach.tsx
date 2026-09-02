"use client";

interface Props {
  data: any;
}

export default function AIDealCoach({
  data,
}: Props) {

  if (!data) {

    return (

      <div
        className="
          bg-gradient-to-br
          from-cyan-500/10
          to-sky-500/10
          border
          border-cyan-500/20
          rounded-3xl
          p-6
          mb-8
        "
      >
        <p className="text-cyan-400">
          Analizando oportunidades...
        </p>
      </div>

    );

  }

  return (

    <div
      className="
        bg-gradient-to-br
        from-cyan-500/10
        to-sky-500/10
        border
        border-cyan-500/20
        rounded-3xl
        p-6
        mb-8
      "
    >

      <p className="text-cyan-400 text-sm">
        AI Deal Coach
      </p>

      <h2 className="text-2xl font-black mt-3">
        Coach Comercial IA
      </h2>

      <div
        className="
          mt-5
          text-zinc-300
          space-y-2
        "
      >

        <p>
          <strong>
            LEAD:
          </strong>{" "}
          {data.bestLead}
        </p>

        <p>
          <strong>
            PRIORIDAD:
          </strong>{" "}
          {
            data.probability >= 50
              ? "Alta"
              : "Media"
          }
        </p>

        <p>
          <strong>
            ACCIÓN:
          </strong>{" "}
          Contactar hoy.
        </p>

        <p>
          <strong>
            MOTIVO:
          </strong>{" "}
          Probabilidad de cierre del{" "}
          {data.probability}%.
        </p>

        <p>
          <strong>
            REVENUE:
          </strong>{" "}
          $
          {data.revenue.toLocaleString()}
        </p>

        <p>
          <strong>
            SIGUIENTE PASO:
          </strong>{" "}
          Agendar llamada.
        </p>

      </div>

    </div>

  );

}