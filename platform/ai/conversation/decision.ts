import {
  aiGateway,
} from "@/platform/ai/gateway";

import {
  aiConversationContextBuilder,
} from "./builder";

export type ConversationIntent =
  | "whatsapp.general"
  | "whatsapp.followup"
  | "whatsapp.interest"
  | "whatsapp.objection"
  | "whatsapp.closing"
  | "whatsapp.proposal"
  | "whatsapp.human";

export interface ConversationDecision {
  intent: ConversationIntent;
  confidence: number;
  requiresHuman: boolean;
  reason: string;
  provider: string;
  model: string;
  conversationId: string;
  messageCount: number;
  duration: number;
}

export interface ConversationDecisionRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
}

function normalizeMessage(
  message: string,
): string {

  return message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function detectHumanRequest(
  message: string,
): boolean {

  const normalized =
    normalizeMessage(message);

  const patterns = [
    "hablar con una persona",
    "hablar con un humano",
    "quiero un asesor",
    "quiero hablar con alguien",
    "quiero hablar con una persona",
    "quiero hablar con un humano",
    "necesito un asesor",
    "necesito hablar con alguien",
    "atencion humana",
    "atencion de una persona",
    "pasame con una persona",
    "pasame con un asesor",
    "comunicarme con una persona",
    "comunicarme con un asesor",
  ];

  return patterns.some(
    pattern =>
      normalized.includes(pattern),
  );
}

function detectProposalRequest(
  message: string,
): boolean {

  const normalized =
    normalizeMessage(message);

  const proposalPatterns = [
    "cotizacion",
    "cotizar",
    "cotizame",
    "presupuesto",
    "propuesta comercial",
    "propuesta de venta",
    "precio por",
    "precio de",
    "cuanto cuesta",
    "cuanto sale",
    "cuanto vale",
    "me das precio",
    "dame precio",
    "quiero precio",
    "necesito precio",
  ];

  return proposalPatterns.some(
    pattern =>
      normalized.includes(pattern),
  );
}

function parseDecision(
  text: string,
): {
  intent: ConversationIntent;
  confidence: number;
  reason: string;
} {

  const fallback = {
    intent: "whatsapp.general" as ConversationIntent,
    confidence: 0.5,
    reason: "Clasificación general de conversación.",
  };

  try {

    const cleaned =
      text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    const parsed =
      JSON.parse(cleaned) as {
        intent?: string;
        confidence?: number;
        reason?: string;
      };

    const validIntents: ConversationIntent[] = [
      "whatsapp.general",
      "whatsapp.followup",
      "whatsapp.interest",
      "whatsapp.objection",
      "whatsapp.closing",
      "whatsapp.proposal",
      "whatsapp.human",
    ];

    const intent =
      validIntents.includes(
        parsed.intent as ConversationIntent,
      )
        ? parsed.intent as ConversationIntent
        : fallback.intent;

    const confidence =
      typeof parsed.confidence === "number"
        ? Math.max(
            0,
            Math.min(1, parsed.confidence),
          )
        : fallback.confidence;

    return {
      intent,
      confidence,
      reason:
        typeof parsed.reason === "string"
          ? parsed.reason
          : fallback.reason,
    };

  } catch {
    return fallback;
  }
}

export class AIConversationDecisionEngine {

  async decide(
    request: ConversationDecisionRequest,
  ): Promise<ConversationDecision> {

    const startedAt =
      Date.now();

    const currentMessage =
      request.message.trim();

    if (
      detectHumanRequest(currentMessage)
    ) {

      return {
        intent: "whatsapp.human",
        confidence: 0.99,
        requiresHuman: true,
        reason:
          "El cliente solicita atención humana.",
        provider: "deterministic",
        model: "rule-engine",
        conversationId:
          request.conversationId,
        messageCount: 1,
        duration:
          Date.now() - startedAt,
      };
    }

    if (
      detectProposalRequest(currentMessage)
    ) {

      return {
        intent: "whatsapp.proposal",
        confidence: 0.99,
        requiresHuman: false,
        reason:
          "El cliente solicita una cotización o propuesta comercial.",
        provider: "deterministic",
        model: "rule-engine",
        conversationId:
          request.conversationId,
        messageCount: 1,
        duration:
          Date.now() - startedAt,
      };
    }

    const context =
      await aiConversationContextBuilder.build({
        userId:
          request.userId,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        conversationId:
          request.conversationId,

        contactPhone:
          request.contactPhone,

        contactName:
          request.contactName,

        limit:
          Math.min(
            request.limit ?? 20,
            6,
          ),
      });

    const recentHistory =
      context.messages
        .slice(-6)
        .map(
          message =>
            `${message.role === "user" ? "Cliente" : "Asistente"}: ${message.content}`,
        )
        .join("\n");

    const prompt = `
Clasifica la intención del MENSAJE ACTUAL de un cliente de WhatsApp.

El mensaje actual tiene prioridad absoluta.
El historial solamente sirve como contexto.
No copies información del historial para cambiar la intención del mensaje actual.

INTENCIONES PERMITIDAS:

- whatsapp.general
- whatsapp.followup
- whatsapp.interest
- whatsapp.objection
- whatsapp.closing
- whatsapp.proposal
- whatsapp.human

CRITERIOS:

whatsapp.general:
Preguntas generales, saludos o conversación sin una intención comercial específica.

whatsapp.followup:
Continuación de una conversación comercial cuando el cliente aporta información adicional o responde a una pregunta anterior.

whatsapp.interest:
El cliente muestra interés en comprar, contratar, conocer un producto o avanzar comercialmente.

whatsapp.objection:
El cliente plantea precio, costo, duda, condición, comparación u otra objeción comercial sin solicitar una cotización concreta.

whatsapp.closing:
El cliente expresa intención clara de cerrar, comprar, contratar, confirmar o proceder.

whatsapp.proposal:
El cliente solicita una cotización, presupuesto, precio formal, propuesta comercial o propuesta de venta.

whatsapp.human:
El cliente solicita explícitamente hablar con una persona o asesor.

MENSAJE ACTUAL:
${currentMessage}

HISTORIAL RECIENTE:
${recentHistory || "Sin historial previo."}

Responde únicamente JSON válido:

{
  "intent": "whatsapp.general",
  "confidence": 0.0,
  "reason": "breve explicación"
}
`.trim();

    try {

      const response =
        await aiGateway.generate({
          prompt,
          temperature: 0.1,
          numPredict: 40,
        });

      const parsed =
        parseDecision(
          response.text ?? "",
        );

      return {
        intent:
          parsed.intent,

        confidence:
          parsed.confidence,

        requiresHuman:
          parsed.intent === "whatsapp.human",

        reason:
          parsed.reason,

        provider:
          response.provider,

        model:
          response.model,

        conversationId:
          context.conversationId,

        messageCount:
          context.messageCount,

        duration:
          response.duration,
      };

    } catch {

      return {
        intent:
          "whatsapp.general",

        confidence:
          0.5,

        requiresHuman:
          false,

        reason:
          "No fue posible clasificar la intención; se utiliza conversación general.",

        provider:
          "fallback",

        model:
          "fallback",

        conversationId:
          context.conversationId,

        messageCount:
          context.messageCount,

        duration:
          Date.now() - startedAt,
      };
    }
  }
}

export const aiConversationDecisionEngine =
  new AIConversationDecisionEngine();
