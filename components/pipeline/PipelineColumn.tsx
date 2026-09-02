"use client";

import { useDroppable } from "@dnd-kit/core";

import PipelineLeadCard from "@/components/PipelineLeadCard";

export default function PipelineColumn({
  column,
}: any) {

  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: column.title,
  });

  return (

    <div
      ref={setNodeRef}
      className={`
        rounded-3xl
        p-5
        min-h-[700px]
        border
        transition-all

        ${
          isOver

            ? `
              border-cyan-500
              bg-cyan-500/5
            `

            : `
              border-zinc-800
              bg-[#111113]
            `
        }
      `}
    >

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-white
          "
        >
          {column.title}
        </h2>

        <span
          className="
            bg-zinc-800
            px-3
            py-1
            rounded-full
            text-sm
            text-white
          "
        >
          {column.leads.length}
        </span>

      </div>

      <div className="space-y-4">

        {[...column.leads]

          .sort(
            (
              a: any,
              b: any
            ) => {

              const priority: Record<
                string,
                number
              > = {

                HOT: 3,
                WARM: 2,
                COLD: 1,

              };

              return (

                (
                  priority[
                    String(
                      b.ai_temperature
                    )
                  ] || 0
                )

                -

                (
                  priority[
                    String(
                      a.ai_temperature
                    )
                  ] || 0
                )

              );

            }
          )

          .map(
            (lead: any) => (

              <PipelineLeadCard
                key={lead.id}
                lead={lead}
              />

            )
          )}

      </div>

    </div>

  );

}