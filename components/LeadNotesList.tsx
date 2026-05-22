export default function LeadNotesList({
  notes,
}: {
  notes: any[];
}) {

  if (
    !notes ||
    notes.length === 0
  ) {

    return (

      <div
        className="
          text-xs
          text-zinc-500
          mt-3
        "
      >
        Sin notas todavía.
      </div>

    );

  }

  return (

    <div className="mt-4 space-y-3">

      {
        notes.map((note) => (

          <div
            key={note.id}
            className="
              bg-white dark:bg-[#111113]
              border border-zinc-200 dark:border-zinc-800
              rounded-2xl
              p-3
            "
          >

            <p
              className="
                text-sm
                text-black dark:text-white
                leading-relaxed
              "
            >
              {note.note}
            </p>

            <p
              className="
                text-[11px]
                text-zinc-500
                mt-2
              "
            >

              {
                new Date(
                  note.created_at
                ).toLocaleString()
              }

            </p>

          </div>

        ))
      }

    </div>

  );

}