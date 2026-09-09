import { Permissions } from "@/platform/auth/permissions";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  taskRepository,
} from "@/platform/repositories/task";

export async function POST(
  request: NextRequest
) {
  try {
    // =======================================
    // AUTHENTICATION
    // =======================================

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.TASKS_CREATE);

    // =======================================
    // REQUEST
    // =======================================

    const body =
      await request.json();

    const {
      lead_name,
      title,
      description,
      priority = "MEDIUM",
      due_date = null,
      assigned_to = null,
      notes = null,
      source = "pipeline",
      ai_generated = false,
    } = body;

    if (
      !lead_name ||
      !title
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const userId =
      user.id;

    // =======================================
    // DUPLICATE CHECK
    // =======================================

    const existingTask =
      await taskRepository.findPendingByLead({
        userId,
        organizationId:
          tenant.organizationId,
        workspaceId:
          tenant.workspaceId,
        leadName:
          lead_name,
      });

    if (existingTask) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message:
          "Ya existe una tarea pendiente para este lead.",
        taskId:
          existingTask.id,
      });
    }

    // =======================================
    // CREATE TASK
    // =======================================

    const data =
      await taskRepository.create({
        userId,
        organizationId:
          tenant.organizationId,
        workspaceId:
          tenant.workspaceId,
        leadName:
          lead_name,
        title,
        description,
        priority,
        status:
          "pending",
        dueDate:
          due_date,
        completedAt:
          null,
        assignedTo:
          assigned_to,
        source,
        aiGenerated:
          ai_generated,
        notes,
      });

    return NextResponse.json({
      success: true,
      skipped: false,
      task: data,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

