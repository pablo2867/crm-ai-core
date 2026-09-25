import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { tenantEngine } from "@/platform/tenant";
import {
  conversationHandoffService,
} from "@/platform/services/conversation-handoff";

interface RouteContext {
  params: Promise<{
    conversationId: string;
  }>;
}

type Action =
  | "assign"
  | "start"
  | "resolve"
  | "cancel";

async function getAuthenticatedTenant() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 },
      ),
    };
  }

  const tenant = await tenantEngine.getTenant(user.id);

  if (!tenant) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error: "TENANT_NOT_FOUND",
        },
        { status: 404 },
      ),
    };
  }

  return {
    user,
    tenant,
  };
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const auth = await getAuthenticatedTenant();

    if (auth.error) {
      return auth.error;
    }

    const { user, tenant } = auth;
    const { conversationId } = await context.params;

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error: "CONVERSATION_ID_REQUIRED",
        },
        { status: 400 },
      );
    }

    const handoff =
      await conversationHandoffService.getActive({
        conversationId,
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
      });

    if (!handoff) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: handoff.id,
        conversationId: handoff.conversationId,
        userId: handoff.userId,
        organizationId: handoff.organizationId,
        workspaceId: handoff.workspaceId,
        status: handoff.status,
        reason: handoff.reason,
        intent: handoff.intent,
        confidence: handoff.confidence,
        assigned_to: handoff.assignedTo,
        assigned_at: handoff.assignedAt,
        requested_at: handoff.requestedAt,
        started_at: handoff.startedAt,
        resolved_at: handoff.resolvedAt,
        resolution_note: handoff.resolutionNote,
        metadata: handoff.metadata,
        created_at: handoff.createdAt,
        updated_at: handoff.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "WHATSAPP_HANDOFF_GET_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "HANDOFF_QUERY_FAILED",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const auth = await getAuthenticatedTenant();

    if (auth.error) {
      return auth.error;
    }

    const { user, tenant } = auth;
    const { conversationId } = await context.params;

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error: "CONVERSATION_ID_REQUIRED",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const action = body?.action as Action | undefined;

    if (
      action !== "assign" &&
      action !== "start" &&
      action !== "resolve" &&
      action !== "cancel"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_HANDOFF_ACTION",
        },
        { status: 400 },
      );
    }

    const baseRequest = {
      conversationId,
      userId: user.id,
      organizationId: tenant.organizationId,
      workspaceId: tenant.workspaceId,
    };

    let handoff;

    switch (action) {
      case "assign":
        handoff =
          await conversationHandoffService.assign({
            ...baseRequest,
            assignedTo:
              body?.assignedTo || user.id,
          });
        break;

      case "start":
        handoff =
          await conversationHandoffService.start(
            baseRequest,
          );
        break;

      case "resolve":
        handoff =
          await conversationHandoffService.resolve({
            ...baseRequest,
            resolutionNote:
              body?.resolutionNote || null,
          });
        break;

      case "cancel":
        handoff =
          await conversationHandoffService.cancel(
            baseRequest,
          );
        break;
    }

    return NextResponse.json({
      success: true,
      data: handoff,
    });
  } catch (error) {
    console.error(
      "WHATSAPP_HANDOFF_ACTION_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "HANDOFF_ACTION_FAILED",
      },
      { status: 500 },
    );
  }
}