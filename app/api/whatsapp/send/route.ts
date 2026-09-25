import { NextResponse } from "next/server";

import { authEngine } from "@/platform/auth/engine";
import { Permissions } from "@/platform/auth/permissions";

import {
  sendWhatsAppMessage,
} from "@/platform/integrations/twilio/service";

import {
  conversationService,
} from "@/platform/services/conversations";

import {
  tenantEngine,
} from "@/platform/tenant/engine";

function normalizeWhatsAppNumber(
  value: string,
): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("whatsapp:")) {
    return trimmed;
  }

  return `whatsapp:${trimmed}`;
}

export async function POST(
  request: Request,
) {
  try {
    const user =
      await authEngine.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    await authEngine.requirePermission(
      Permissions.AI_EXECUTE,
    );

    const tenant =
      await tenantEngine.getTenant(
        user.id,
      );

    const body =
      await request.json();

    const toRaw =
      typeof body.to === "string"
        ? body.to.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!toRaw || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "TO_AND_MESSAGE_REQUIRED",
        },
        { status: 400 },
      );
    }

    const to =
      normalizeWhatsAppNumber(
        toRaw,
      );

    const from =
      normalizeWhatsAppNumber(
        process.env.TWILIO_WHATSAPP_FROM ?? "",
      );

    const conversation =
      await conversationService.createConversation({
        userId: tenant.userId,
        organizationId:
          tenant.organizationId,
        workspaceId:
          tenant.workspaceId,
        channel: "whatsapp",
        contactPhone: to,
      });

    const result =
      await sendWhatsAppMessage({
        to,
        body: message,
      });

    const savedMessage =
      await conversationService.addMessage({
        conversationId:
          conversation.id,
        userId: tenant.userId,
        organizationId:
          tenant.organizationId,
        workspaceId:
          tenant.workspaceId,
        direction: "outbound",
        sender: from,
        recipient: to,
        body: message,
        provider: "twilio",
        providerMessageId:
          result.sid,
        status: result.status === "queued" || result.status === "sent" || result.status === "delivered" || result.status === "read" || result.status === "failed" ? result.status : "sent",
        metadata: {
          twilio: result,
        },
      });

    return NextResponse.json({
      success: true,
      result,
      conversation,
      message: savedMessage,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR";

    const status =
      errorMessage === "UNAUTHORIZED"
        ? 401
        : errorMessage === "TWILIO_NOT_CONFIGURED"
          ? 503
          : 500;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status },
    );
  }
}
