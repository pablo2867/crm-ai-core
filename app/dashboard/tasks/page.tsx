import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

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

    <div className="min-h-screen bg-gray-100 p-8 text-black">

      <h1 className="text-4xl font-bold mb-8">

        AI Tasks Dashboard

      </h1>

      {!tasks ||
      tasks.length === 0 ? (

        <div className="bg-white rounded-xl p-6 shadow">

          No hay tareas todavía.

        </div>

      ) : (

        <div className="grid gap-5">

          {tasks.map((task) => (

            <div

              key={task.id}

              className="bg-white rounded-xl p-6 shadow border"

            >

              <div className="flex items-center justify-between">

                <h2 className="text-2xl font-semibold">

                  {task.title}

                </h2>

                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">

                  {task.priority}

                </span>

              </div>

              <p className="mt-3 text-gray-700">

                {task.description}

              </p>

              <div className="mt-4 text-sm text-gray-500">

                Lead:
                {" "}
                {task.lead_name}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}