"use client";

import { useRouter } from "next/navigation";

interface Props {
  taskId: string;
}

export default function TaskActions({
  taskId,
}: Props) {

  const router =
    useRouter();

  async function completeTask() {

    await fetch(
      "/api/tasks",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id: taskId,
        }),
      }
    );

    router.refresh();

  }

  async function deleteTask() {

    const confirmed =
      confirm(
        "¿Eliminar esta tarea?"
      );

    if (!confirmed) {
      return;
    }

    await fetch(
      "/api/tasks",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          id: taskId,
        }),
      }
    );

    router.refresh();

  }

  return (

    <div
      className="
        flex
        gap-3
        mt-6
      "
    >

      <button
        onClick={completeTask}
        className="
          px-4
          py-2
          rounded-xl
          bg-green-500/20
          text-green-400
          hover:bg-green-500/30
          transition
        "
      >
        ✓ Completar
      </button>

      <button
        onClick={deleteTask}
        className="
          px-4
          py-2
          rounded-xl
          bg-red-500/20
          text-red-400
          hover:bg-red-500/30
          transition
        "
      >
        🗑 Eliminar
      </button>

    </div>

  );

}