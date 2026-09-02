import DiagnosticsGrid from "@/components/diagnostics/layout/DiagnosticsGrid";

import {
  skillRegistry,
} from "@/platform/skills/registry";

import {
  workflowRegistry,
} from "@/platform/workflows";

import {
  agentRegistry,
} from "@/platform/agents/registry";

import {
  getBricks,
} from "@/platform/registry";

export default function SystemPage() {

  /*
  ---------------------------------------
  Server-side registry inspection
  ---------------------------------------
  */

  const skills =
    skillRegistry.getAll().length;

  const workflows =
    workflowRegistry.getAll().length;

  const agents =
    agentRegistry.getAll().length;

  /*
  ---------------------------------------
  Platform Bricks
  ---------------------------------------
  */

  const bricks =
    getBricks();

  return (

    <main className="p-8 space-y-6">

      <div>

        <h1 className="text-4xl font-black">
          AI CORE Diagnostics
        </h1>

        <p className="text-zinc-500">
          System Dashboard
        </p>

      </div>

      <DiagnosticsGrid

        skills={skills}

        workflows={workflows}

        agents={agents}

      />

      <div
        className="
          rounded-2xl
          border
          border-zinc-800
          p-6
        "
      >

        <h2 className="text-xl font-bold mb-4">
          Registered Bricks
        </h2>

        <p className="text-zinc-400 mb-6">
          Total: {bricks.length}
        </p>

        <div className="space-y-4">

          {bricks.map((brick) => (

            <div
              key={brick.id}
              className="
                rounded-xl
                border
                border-zinc-700
                p-4
              "
            >

              <h3 className="font-bold">
                {brick.name}
              </h3>

              <p className="text-sm text-zinc-500">
                {brick.description}
              </p>

              <div className="mt-2 text-xs text-zinc-400">
                Version: {brick.version}
              </div>

              <div className="text-xs">

                Status{" "}

                <span
                  className={
                    brick.enabled
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >

                  {brick.enabled
                    ? "Enabled"
                    : "Disabled"}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}
