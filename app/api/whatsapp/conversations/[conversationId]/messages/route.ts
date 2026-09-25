import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { tenantEngine } from "@/platform/tenant";
import { conversationService } from "@/platform/services/conversations";

interface RouteContext {
  params: Promise<{
    conversationId: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    const tenant = await tenantEngine.getTenant(user.id);

    if (!tenant) {
      return NextResponse.json(
        {
          success: false,
          error: "TENANT_NOT_FOUND",
        },
        { status: 404 },
      );
    }

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

    const url = new URL(request.url);

    const rawLimit = Number.parseInt(
      url.searchParams.get("limit") ?? "100",
      10,
    );

    const rawOffset = Number.parseInt(
      url.searchParams.get("offset") ?? "0",
      10,
    );

    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 200)
      : 100;

    const offset = Number.isFinite(rawOffset)
      ? Math.max(rawOffset, 0)
      : 0;

    const messages =
      await conversationService.listMessages({
        conversationId,
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
        limit,
        offset,
      });

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        limit,
        offset,
        count: messages.length,
      },
    });
  } catch (error) {
    console.error(
      "WHATSAPP_CONVERSATION_MESSAGES_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "CONVERSATION_MESSAGES_FAILED",
      },
      { status: 500 },
    );
  }
}
