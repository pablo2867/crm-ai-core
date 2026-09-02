import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  authEngine,
} from "@/platform/auth";

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

    // =======================================
    // USER / TENANT
    // =======================================

    // La identidad y el tenant siempre
    // provienen del contexto autenticado.

    const userId =
      user.id;

    // =======================================
    // DUPLICATE CHECK
    // =======================================

    const {
      data: existingTask,
      error: existingError,
    } = await supabaseAdmin
      .from("tasks")
      .select("id")
      .eq(
        "user_id",
        userId
      )
      .eq(
        "organization_id",
        tenant.organizationId
      )
      .eq(
        "workspace_id",
        tenant.workspaceId
      )
      .eq(
        "lead_name",
        lead_name
      )
      .eq(
        "status",
        "pending"
      )
      .maybeSingle();

    if (existingError) {
      console.error(
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            existingError.message,
        },
        {
          status: 500,
        }
      );
    }

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

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("tasks")
      .insert({
        user_id:
          userId,

        organization_id:
          tenant.organizationId,

        workspace_id:
          tenant.workspaceId,

        lead_name,

        title,

        description,

        priority,

        status:
          "pending",

        due_date,

        completed_at:
          null,

        assigned_to,

        source,

        ai_generated,

        notes,
      })
      .select()
      .single();

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      skipped: false,
      task: data,
    });

  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
