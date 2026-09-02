"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import PipelineColumn from "@/components/pipeline/PipelineColumn";

export default function PipelineBoard({
  columns,
}: any) {

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragEnd = async (
    event: DragEndEvent
  ) => {

    const {
      active,
      over,
    } = event;

    console.log(
      "DRAG END:",
      active?.id,
      over?.id
    );

    if (!over) {
      return;
    }

    const leadId =
      Number(active.id);

    const newStatus =
      String(over.id);

    try {

      const response =
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
              status: newStatus,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "UPDATE RESPONSE:",
        data
      );

      if (response.ok) {

        window.location.reload();

      }

    } catch (error) {

      console.log(
        "DND ERROR:",
        error
      );

    }

  };

  return (

    <DndContext
      sensors={sensors}
      onDragEnd={onDragEnd}
    >

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          xl:grid-cols-3
          gap-6
          items-start
        "
      >

        {columns.map(
          (column: any) => (

            <PipelineColumn
              key={column.title}
              column={column}
            />

          )
        )}

      </div>

    </DndContext>

  );

}