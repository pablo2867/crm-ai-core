interface AIStatusCardProps {

  skills: number;

  workflows: number;

  agents: number;

}

export default function AIStatusCard({

  skills,

  workflows,

  agents,

}: AIStatusCardProps) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-800
        bg-[#111113]
        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        AI CORE Status
      </h2>

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Skills
          </span>

          <span className="font-bold">
            {skills}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Workflows
          </span>

          <span className="font-bold">
            {workflows}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Agents
          </span>

          <span className="font-bold">
            {agents}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Model
          </span>

          <span className="text-green-400 font-semibold">
            qwen2.5:3b
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Status
          </span>

          <span className="text-green-500 font-bold">
            ● Online
          </span>

        </div>

      </div>

    </div>

  );

}

