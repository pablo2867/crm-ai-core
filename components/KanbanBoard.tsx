"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  status: string;
};

export default function KanbanBoard({
  leads,
}: {
  leads: Lead[];
}) {

  const columns = {
    Nuevo: leads.filter(
      (lead) => lead.status === "Nuevo"
    ),

    Contactado: leads.filter(
      (lead) => lead.status === "Contactado"
    ),

    Cerrado: leads.filter(
      (lead) => lead.status === "Cerrado"
    ),
  };

  async function onDragEnd(result: any) {

    if (!result.destination) return;

    const leadId = result.draggableId;

    const newStatus =
      result.destination.droppableId;

    await fetch("/api/update-status", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id: leadId,
        status: newStatus,
      }),
    });

    window.location.reload();
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>

      <div className="grid grid-cols-3 gap-6">

        {Object.entries(columns).map(
          ([columnId, items]) => (

            <Droppable
              droppableId={columnId}
              key={columnId}
            >

              {(provided) => (

                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-[#111113] rounded-3xl border border-zinc-800 p-5 min-h-[600px]"
                >

                  <h2 className="text-2xl font-bold mb-6">
                    {columnId}
                  </h2>

                  <div className="space-y-4">

                    {items.map((lead, index) => (

                      <Draggable
                        draggableId={String(lead.id)}
                        index={index}
                        key={lead.id}
                      >

                        {(provided) => (

                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-[#18181B] border border-zinc-700 rounded-2xl p-4"
                          >

                            <h3 className="font-bold text-lg">
                              {lead.name}
                            </h3>

                            <p className="text-zinc-400 mt-1">
                              {lead.company}
                            </p>

                            <p className="text-zinc-500 text-sm mt-3">
                              {lead.email}
                            </p>

                          </div>

                        )}

                      </Draggable>

                    ))}

                    {provided.placeholder}

                  </div>

                </div>

              )}

            </Droppable>

          )
        )}

      </div>

    </DragDropContext>
  );
}