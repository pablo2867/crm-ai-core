"use client";

import {
  useState,
} from "react";

export default function LeadNotes({
  leadId,
}: {
  leadId: number;
}) {

  const [
    note,
    setNote,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleSave() {

    if (!note.trim()) {
      return;
    }

    try {

      setLoading(true);

      await fetch(
        "/api/lead-notes",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            lead_id:
              leadId,

            note,

          }),

        }
      );

      setNote("");

      window.location.reload();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        mt-4
        bg-zinc-100 dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-2xl
        p-4
      "
    >

      <p className="font-bold mb-3 text-black dark:text-white">
        Notas
      </p>

      <textarea
        value={note}
        onChange={(e) =>
          setNote(
            e.target.value
          )
        }
        placeholder="Agregar nota..."
        className="
          w-full
          min-h-[100px]
          rounded-xl
          p-3
          bg-white dark:bg-[#111113]
          border border-zinc-200 dark:border-zinc-700
          text-black dark:text-white
          outline-none
        "
      />

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="
          mt-3
          bg-blue-600
          hover:bg-blue-700
          transition
          px-4 py-2
          rounded-xl
          text-white
          text-sm
          font-medium
        "
      >

        {
          loading
            ? "Guardando..."
            : "Guardar Nota"
        }

      </button>

    </div>

  );

}