import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { tenantEngine } from "@/platform/tenant";
import {
  conversationCommercialStateService,
} from "@/platform/services/conversation-commercial-state";

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

    const state =
      await conversationCommercialStateService.get({
        conversationId,
        userId: user.id,
        organizationId: tenant.organizationId,
        workspaceId: tenant.workspaceId,
      });

    return NextResponse.json({
      success: true,
      data: state,
    });
  } catch (error) {
    console.error(
      "WHATSAPP_COMMERCIAL_STATE_API_ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "COMMERCIAL_STATE_FAILED",
      },
      { status: 500 },
    );
  }
}