"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

import LeadCard
from "@/components/LeadCard";

export default function PipelineBoard({
  columns,
}: any) {

  const onDragEnd = async (
    result: any
  ) => {

    if (
      !result.destination
    ) return;

    const leadId =
      Number(
        result.draggableId
      );

    const newStatus =
      result.destination
        .droppableId;

    try {

      await fetch(
        "/api/update-status",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            id: leadId,

            status:
              newStatus,

          }),

        }
      );

    } catch (err) {

      console.log(err);

    }

  };

  return (

    <DragDropContext
      onDragEnd={onDragEnd}
    >

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3

          gap-6
        "
      >

        {

          columns.map(
            (column: any) => (

              <Droppable
                droppableId={
                  column.title
                }
                key={column.title}
              >

                {(provided) => (

                  <div

                    ref={
                      provided.innerRef
                    }

                    {
                      ...provided.droppableProps
                    }

                    className="
                      bg-white
                      dark:bg-[#111113]

                      border
                      border-zinc-200
                      dark:border-zinc-800

                      rounded-3xl

                      p-5

                      min-h-[500px]
                    "
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
                          text-black
                          dark:text-white
                        "
                      >
                        {column.title}
                      </h2>

                      <span
                        className="
                          bg-zinc-100
                          dark:bg-zinc-800

                          px-3 py-1

                          rounded-full

                          text-sm
                        "
                      >
                        {
                          column.leads.length
                        }
                      </span>

                    </div>

                    <div className="space-y-5">

                      {

                        column.leads.map(
                          (
                            lead: any,
                            index: number
                          ) => (

                            <Draggable

                              key={lead.id}

                              draggableId={
                                String(
                                  lead.id
                                )
                              }

                              index={index}
                            >

                              {(provided) => (

                                <div

                                  ref={
                                    provided.innerRef
                                  }

                                  {
                                    ...provided.draggableProps
                                  }

                                  {
                                    ...provided.dragHandleProps
                                  }
                                >

                                  <LeadCard
                                    lead={lead}
                                  />

                                </div>

                              )}

                            </Draggable>

                          )

                        )

                      }

                      {
                        provided.placeholder
                      }

                    </div>

                  </div>

                )}

              </Droppable>

            )

          )

        }

      </div>

    </DragDropContext>

  );

}