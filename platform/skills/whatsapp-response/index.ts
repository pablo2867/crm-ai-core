import {
  aiConversationResponseEngine,
} from "@/platform/ai/conversation";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

interface WhatsAppResponseInput {
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
  decision: import("@/platform/ai/conversation").ConversationDecision;
}

export const whatsappResponseSkillDefinition:
  SkillDefinition = {

  id:
    "whatsapp-response",

  name:
    "WhatsApp Response",

  description:
    "Genera una respuesta conversacional de WhatsApp utilizando el contexto de la conversación.",

  async execute(
    request: SkillRequest,
  ): Promise<SkillResult> {

    const input =
      (
        request.input ?? {}
      ) as Partial<WhatsAppResponseInput>;

    if (!input.conversationId) {
      return {
        success: false,
        message:
          "Conversation ID requerido.",
        error:
          "WHATSAPP_CONVERSATION_ID_REQUIRED",
      };
    }

    if (!input.contactPhone) {
      return {
        success: false,
        message:
          "Teléfono de contacto requerido.",
        error:
          "WHATSAPP_CONTACT_PHONE_REQUIRED",
      };
    }

    if (!input.message) {
      return {
        success: false,
        message:
          "Mensaje requerido.",
        error:
          "WHATSAPP_MESSAGE_REQUIRED",
      };
    }

    if (!input.decision) {
      return {
        success: false,
        message:
          "Decisión conversacional requerida.",
        error:
          "WHATSAPP_CONVERSATION_DECISION_REQUIRED",
      };
    }

    const response =
      await aiConversationResponseEngine.generate({

        userId:
          request.userId ?? "",

        organizationId:
          request.organizationId ?? "",

        workspaceId:
          request.workspaceId ?? "",

        conversationId:
          input.conversationId,

        contactPhone:
          input.contactPhone,

        contactName:
          input.contactName,

        message:
          input.message,

        limit:
          input.limit ?? 20,

        decision:
          input.decision,

      });

    if (!response.success) {
      return {
        success: false,
        message:
          response.error ??
          "No fue posible generar la respuesta de WhatsApp.",
        error:
          response.errorCode ??
          "WHATSAPP_RESPONSE_FAILED",
      };
    }

    if (!response.text.trim()) {
      return {
        success: false,
        message:
          "La respuesta de WhatsApp está vacía.",
        error:
          "WHATSAPP_RESPONSE_EMPTY",
      };
    }

    return {
      success: true,

      message:
        "Respuesta de WhatsApp generada.",

      data: {
        text:
          response.text.trim(),

        provider:
          response.provider,

        model:
          response.model,

        duration:
          response.duration,

        conversationId:
          response.conversationId,

        messageCount:
          response.messageCount,

        decision:
          response.decision,
      },
    };
  },
};

export async function whatsappResponseSkill(
  request: SkillRequest,
): Promise<SkillResult> {

  return whatsappResponseSkillDefinition.execute(
    request,
  );
}
