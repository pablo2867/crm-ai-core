import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { tenantEngine } from "@/platform/tenant";
import { conversationService } from "@/platform/services/conversations";

export async function GET(request: Request) {
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

    const url = new URL(request.url);

    const statusParam = url.searchParams.get("status");
    const channelParam = url.searchParams.get("channel");

    const rawLimit = Number.parseInt(
      url.searchParams.get("limit") ?? "50",
      10,
    );

    const rawOffset = Number.parseInt(
      url.searchParams.get("offset") ?? "0",
      10,
    );

    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 100)
      : 50;

    const offset = Number.isFinite(rawOffset)
      ? Math.max(rawOffset, 0)
      : 0;

    const status =
      statusParam === "open" ||
      statusParam === "closed" ||
      statusParam === "archived"
        ? statusParam
        : undefined;

    const channel =
      channelParam === "whatsapp"
        ? channelParam
        : undefined;

    const conversations =
      await conversationService.listConversations({
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
        status,
        channel,
        limit,
        offset,
      });

    return NextResponse.json({
      success: true,
      data: conversations,
      pagination: {
        limit,
        offset,
        count: conversations.length,
      },
    });
  } catch (error) {
    console.error(
      "WHATSAPP_CONVERSATIONS_LIST_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "CONVERSATIONS_LIST_FAILED",
      },
      { status: 500 },
    );
  }
}
