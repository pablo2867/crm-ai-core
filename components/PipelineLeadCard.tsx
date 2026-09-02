"use client";

import { useDraggable } from "@dnd-kit/core";

export default function PipelineLeadCard({
  lead,
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: String(lead.id),
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="
        bg-red-500
        text-white
        p-4
        rounded-xl
        cursor-grab
      "
    >
      TEST DRAG

      <br />

      {lead.name}
    </div>
  );
}