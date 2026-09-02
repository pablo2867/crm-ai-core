import {
  authEngine,
} from "@/platform/auth";

import {
  getRecentTasks,
} from "@/platform/services/tasks/read";

interface TasksWidgetProps {
  userId: string;
}

export default async function TasksWidget({
  userId,
}: TasksWidgetProps) {

  const tenant =
    await authEngine.getTenant();

  let tasks = [];

  try {

    tasks =
      await getRecentTasks({

        userId:
          tenant.userId,

        organizationId:
          tenant.organizationId,

        workspaceId:
          tenant.workspaceId,

      }, 5);

  } catch (error) {

    console.error(
      "TASKS WIDGET ERROR:",
      error
    );

  }

  return (

    <div className="bg-[#111113] border border-zinc-800 rounded-3xl p-6 shadow-2xl">

      <div className="mb-8">

        <p className="text-zinc-500 text-sm">
          CRM AI
        </p>

        <h2 className="text-3xl font-black text-white mt-2">
          AI Tasks
        </h2>

      </div>

      <div className="space-y-4">

        {tasks?.map((task) => (

          <div
            key={task.id}
            className="
              bg-[#18181B]
              border
              border-zinc-700
              rounded-2xl
              p-4
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="font-bold text-white">
                  {task.lead_name}
                </p>

                <p className="text-zinc-500 text-sm mt-1">
                  {task.status}
                </p>

              </div>

              <div
                className={
                  task.status === "completed"
                    ? "w-3 h-3 rounded-full bg-green-500"
                    : "w-3 h-3 rounded-full bg-yellow-500"
                }
              />

            </div>

          </div>

        ))}

        {(!tasks || tasks.length === 0) && (

          <div
            className="
              bg-[#18181B]
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-zinc-400
            "
          >
            No hay tareas.
          </div>

        )}

      </div>

    </div>

  );

}



