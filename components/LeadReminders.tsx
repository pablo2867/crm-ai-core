"use client";

import {
  useState,
} from "react";

export default function LeadReminders({
  leadId,
}: any) {

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    remindAt,
    setRemindAt,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleCreate =
    async () => {

      if (
        !title ||
        !remindAt
      ) {

        alert(
          "Completa todos los campos"
        );

        return;

      }

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/reminders",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                lead_id: leadId,

                title,

                remind_at:
                  remindAt,

              }),

            }
          );

        const data =
          await response.json();

        console.log(
          "REMINDER RESPONSE:",
          data
        );

        if (data.success) {

          alert(
            "Reminder creado"
          );

          window.location.reload();

        } else {

          alert(
            "Error creando reminder"
          );

        }

      } catch (error) {

        console.log(error);

        alert(
          "Error general"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="mt-10">

      <h3
        className="
          text-xl
          font-bold
          text-black dark:text-white
          mb-5
        "
      >
        Recordatorios
      </h3>

      <div className="space-y-4">

        <input
          type="text"

          placeholder="Ej: Llamar mañana"

          value={title}

          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }

          className="
            w-full

            px-4 py-3

            rounded-2xl

            border
            border-zinc-200
            dark:border-zinc-800

            bg-white
            dark:bg-[#111113]

            text-black
            dark:text-white

            outline-none

            focus:ring-2
            focus:ring-blue-500
          "
        />

        <input
          type="datetime-local"

          value={remindAt}

          onChange={(e) =>
            setRemindAt(
              e.target.value
            )
          }

          className="
            w-full

            px-4 py-3

            rounded-2xl

            border
            border-zinc-200
            dark:border-zinc-800

            bg-white
            dark:bg-[#111113]

            text-black
            dark:text-white

            outline-none

            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          type="button"

          onClick={handleCreate}

          disabled={loading}

          className="
            w-full

            bg-blue-600
            hover:bg-blue-700

            transition

            text-white

            py-3

            rounded-2xl

            font-semibold

            disabled:opacity-50
          "
        >

          {

            loading
              ? "Creando..."
              : "Crear Reminder"

          }

        </button>

      </div>

    </div>

  );

}