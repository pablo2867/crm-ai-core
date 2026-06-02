import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import TaskActions
from "@/components/TaskActions";

export const dynamic =
  "force-dynamic";

export default async function TasksPage() {

  const {
    data: tasks,
    error,
  } = await supabaseAdmin

    .from("tasks")

    .select("*")

    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  console.log(
    "TASKS:",
    tasks
  );

  console.log(
    "TASKS ERROR:",
    error
  );

  return (

    <main
      className="
        min-h-screen
        bg-[#09090B]
        text-white
        p-6
        md:p-10
      "
    >

      <div className="mb-10">

        <p
          className="
            text-zinc-500
            text-sm
          "
        >
          CRM AI
        </p>

        <h1
          className="
            text-4xl
            md:text-6xl
            font-black
            mt-2
          "
        >
          AI Tasks
        </h1>

      </div>

      {!tasks ||
      tasks.length === 0 ? (

        <div
          className="
            bg-[#111113]
            border
            border-zinc-800
            rounded-3xl
            p-8
            text-zinc-400
          "
        >
          No hay tareas pendientes.
        </div>

      ) : (

        <div className="grid gap-6">

          {tasks.map(
            (task) => (

              <div

                key={task.id}

                className="
                  bg-[#111113]
                  border
                  border-zinc-800
                  rounded-3xl
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <h2
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    {task.title}
                  </h2>

                  <span
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-red-500/10
                      text-red-400
                      text-sm
                    "
                  >
                    {task.priority}
                  </span>

                </div>

                <p
                  className="
                    mt-4
                    text-zinc-300
                  "
                >
                  {task.description}
                </p>

                <div
                  className="
                    mt-6
                    grid
                    md:grid-cols-3
                    gap-4
                    text-sm
                  "
                >

                  <div>

                    <span
                      className="
                        text-zinc-500
                      "
                    >
                      Lead:
                    </span>

                    <div>
                      {task.lead_name}
                    </div>

                  </div>

                  <div>

                    <span
                      className="
                        text-zinc-500
                      "
                    >
                      Estado:
                    </span>

                    <div>
                      {task.status}
                    </div>

                  </div>

                  <div>

                    <span
                      className="
                        text-zinc-500
                      "
                    >
                      Creada:
                    </span>

                    <div>
                      {new Date(
                        task.created_at
                      ).toLocaleDateString()}
                    </div>

                  </div>

                </div>

                <TaskActions
                  taskId={task.id}
                />

              </div>

            )
          )}

        </div>

      )}

    </main>

  );

}

