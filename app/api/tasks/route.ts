import { Permissions } from "@/platform/auth/permissions";
import { NextResponse } from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  taskRepository,
} from "@/platform/repositories/task";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Task id is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =======================================
    // AUTH + TENANT
    // =======================================

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    await authEngine.requirePermission(Permissions.TASKS_UPDATE);

    // =======================================
    // COMPLETE TASK
    // =======================================

    await taskRepository.complete({
      id,
      userId:
        user.id,
      organizationId:
        tenant.organizationId,
      workspaceId:
        tenant.workspaceId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Task completed successfully.",
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

export async function DELETE(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Task id is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =======================================
    // AUTH + TENANT
    // =======================================

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();
      await authEngine.requirePermission(Permissions.TASKS_DELETE);

    // =======================================
    // DELETE TASK
    // =======================================

    await taskRepository.delete({
      id,
      userId:
        user.id,
      organizationId:
        tenant.organizationId,
      workspaceId:
        tenant.workspaceId,
    });

    return NextResponse.json({
      success: true,
      message:
        "Task deleted successfully.",
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


