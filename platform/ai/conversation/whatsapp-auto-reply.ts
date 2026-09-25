import {
  aiConversationResponseEngine,
  type ConversationDecision,
} from "@/platform/ai/conversation";

import {
  conversationService,
} from "@/platform/services/conversations";

import {
  sendWhatsAppMessage,
} from "@/platform/integrations/twilio/service";

export interface WhatsAppAutoReplyRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
  decision: ConversationDecision;
}

export interface WhatsAppAutoReplyResult {
  success: boolean;
  sent: boolean;
  requiresHuman: boolean;
  text: string;
  conversationId: string;
  messageId?: string;
  providerMessageId?: string;
  intent: string;
  confidence: number;
  error?: string;
}

export class WhatsAppAutoReplyEngine {

  async process(
    request: WhatsAppAutoReplyRequest,
  ): Promise<WhatsAppAutoReplyResult> {

    const response =
      await aiConversationResponseEngine.generate({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        contactPhone: request.contactPhone,
        contactName: request.contactName,
        message: request.message,
        limit: request.limit,
        decision: request.decision,
      });

    if (response.decision.requiresHuman) {
      return {
        success: true,
        sent: false,
        requiresHuman: true,
        text: "",
        conversationId: response.conversationId,
        intent: response.decision.intent,
        confidence: response.decision.confidence,
      };
    }

    if (!response.success || !response.text.trim()) {
      return {
        success: false,
        sent: false,
        requiresHuman: false,
        text: "",
        conversationId: response.conversationId,
        intent: response.decision.intent,
        confidence: response.decision.confidence,
        error:
          response.error ??
          "CONVERSATION_RESPONSE_EMPTY",
      };
    }

    const twilioResponse =
      await sendWhatsAppMessage({
        to: request.contactPhone,
        body: response.text.trim(),
      });

    const message =
      await conversationService.addMessage({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        direction: "outbound",
        body: response.text.trim(),
        sender: twilioResponse.from,
        recipient: twilioResponse.to,
        provider: "twilio",
        providerMessageId: twilioResponse.sid,
        status:
          twilioResponse.status === "queued" ||
          twilioResponse.status === "sent" ||
          twilioResponse.status === "delivered" ||
          twilioResponse.status === "read" ||
          twilioResponse.status === "failed"
            ? twilioResponse.status
            : "sent",
        metadata: {
          twilio: twilioResponse,
          ai: {
            intent: response.decision.intent,
            confidence: response.decision.confidence,
          },
        },
      });

    return {
      success: true,
      sent: true,
      requiresHuman: false,
      text: response.text.trim(),
      conversationId: response.conversationId,
      messageId: message.id,
      providerMessageId: twilioResponse.sid,
      intent: response.decision.intent,
      confidence: response.decision.confidence,
    };
  }
}

export const whatsappAutoReplyEngine =
  new WhatsAppAutoReplyEngine();
