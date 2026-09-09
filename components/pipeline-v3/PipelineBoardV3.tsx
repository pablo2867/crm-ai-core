"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import { useRouter } from "next/navigation";

import { createTask } from "@/lib/services/tasks/createTask";

import PipelineColumnV3 from "./PipelineColumnV3";
import PipelineExecutiveSummary from "./PipelineExecutiveSummary";

interface Props {
  columns: any[];

  onMoveLead: (
    leadId: number,
    newStatus: string
  ) => Promise<void>;
}

export default function PipelineBoardV3({
  columns,
  onMoveLead,
}: Props) {
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const {
      active,
      over,
    } = event;

    if (!over) {
      return;
    }

    const leadId = Number(active.id);

    const newStatus = String(over.id);

    console.log(
      "DRAG OK:",
      leadId,
      newStatus
    );

    try {
      await onMoveLead(
        leadId,
        newStatus
      );
    } catch (error) {
      console.log(
        "MOVE LEAD ERROR:",
        error
      );
    }
  }

  async function handleCreateTasks() {
    const allLeads = columns.flatMap(
      (column) => column.leads
    );

    console.log("==================================");
    console.log("TOTAL LEADS:", allLeads.length);
    console.log("LEADS:", allLeads);
    console.log("==================================");

    let created = 0;
    let skipped = 0;
    let failed = 0;

    for (const lead of allLeads) {
      console.log("PROCESSING LEAD:", lead);

      if (!lead.user_id) {
        console.warn(
          "LEAD SIN user_id:",
          lead
        );

        failed++;
        continue;
      }

      try {
        const result = await createTask({
          userId: lead.user_id,
          leadName: lead.name,
          title: `Seguimiento comercial - ${lead.name}`,
          description:
            "Tarea creada automáticamente desde Executive Pipeline Summary.",
          priority: "MEDIUM",
        });

        console.log(
          "CREATE TASK RESULT:",
          result
        );

        if (result.success) {
          if (result.skipped) {
            skipped++;
          } else {
            created++;
          }
        } else {
          failed++;
        }
      } catch (error) {
        console.error(
          "CREATE TASK ERROR:",
          error
        );

        failed++;
      }
    }

    console.log("CREATED:", created);
    console.log("SKIPPED:", skipped);
    console.log("FAILED:", failed);

    alert(
      `Proceso finalizado

✅ Tareas creadas: ${created}
⏭ Tareas omitidas: ${skipped}
❌ Errores: ${failed}`
    );

    if (created > 0 || skipped > 0) {
      router.push("/dashboard/tasks");
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        <PipelineExecutiveSummary
          columns={columns}
          onCreateTasks={handleCreateTasks}
        />

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            xl:grid-cols-4
            gap-6
            items-start
          "
        >
          {columns.map(
            (column: any) => (
              <PipelineColumnV3
                key={column.title}
                title={column.title}
                leads={column.leads}
              />
            )
          )}
        </div>
      </div>
    </DndContext>
  );
}
