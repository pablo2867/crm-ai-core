import ExecuteWorkflowButton from "./ExecuteWorkflowButton";

interface Props {

  totalLeads: number;

  hotLeads: number;

  estimatedRevenue: number;

}

export default function AICommandCenter({

  totalLeads,

  hotLeads,

  estimatedRevenue,

}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#111113]
        p-8
        h-full
      "
    >

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-black">
            AI Command Center
          </h2>

          <p className="text-zinc-500 mt-2">
            Tu asistente ejecutivo de ventas.
          </p>

        </div>

        <div
          className="
            px-4
            py-2
            rounded-full
            bg-green-500/20
            text-green-400
            text-sm
            font-semibold
          "
        >
          Online
        </div>

      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">

        <div>

          <div className="text-zinc-500 text-sm">
            Leads
          </div>

          <div className="text-4xl font-black mt-2">
            {totalLeads}
          </div>

        </div>

        <div>

          <div className="text-zinc-500 text-sm">
            HOT
          </div>

          <div className="text-4xl font-black text-red-400 mt-2">
            {hotLeads}
          </div>

        </div>

        <div>

          <div className="text-zinc-500 text-sm">
            Revenue
          </div>

          <div className="text-3xl font-black text-green-400 mt-2">
            $
            {estimatedRevenue.toLocaleString()}
          </div>

        </div>

      </div>

      <div
        className="
          mt-10
          rounded-xl
          border
          border-blue-500/20
          bg-blue-500/10
          p-6
        "
      >

        <h3 className="text-lg font-bold text-blue-300">
          AI Executive Status
        </h3>

        <p className="mt-4 text-zinc-300">
          El motor de IA está listo para analizar tu pipeline,
          priorizar oportunidades y ejecutar workflows inteligentes.
        </p>

        <div className="mt-6 space-y-3 text-sm text-zinc-400">

          <div>
            ✓ Decision Engine activo
          </div>

          <div>
            ✓ Workflow Engine activo
          </div>

          <div>
            ✓ Skill Engine activo
          </div>

          <div>
            ✓ Executive Engine activo
          </div>

        </div>

      </div>

      <div className="mt-8">

        <ExecuteWorkflowButton />

      </div>

    </div>

  );

}

