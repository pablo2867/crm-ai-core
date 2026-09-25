import {
  aiGateway,
} from "@/platform/ai/gateway";

import {
  aiConversationContextBuilder,
} from "./builder";

import {
  commercialConversationIntelligence,
} from "./commercial-intelligence";

import {
  analyzeObjections,
} from "./objection-intelligence";

import {
  generateObjectionResponse,
} from "./objection-response";

export interface GenerateConversationResponseRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
}

export interface GenerateConversationResponseResult {
  success: boolean;
  text: string;
  provider: string;
  model: string;
  conversationId: string;
  messageCount: number;
  duration: number;
  error?: string;
  errorCode?: string;
}

export class AIConversationRuntime {

  async generateResponse(
    request: GenerateConversationResponseRequest,
  ): Promise<GenerateConversationResponseResult> {

    const context =
      await aiConversationContextBuilder.build({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        contactPhone: request.contactPhone,
        contactName: request.contactName,
        limit: Math.min(request.limit ?? 20, 6),
      });

    const currentMessage =
      request.message.trim();

    const commercialResult =
      await commercialConversationIntelligence.extract({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        contactPhone: request.contactPhone,
        contactName: request.contactName,
        message: currentMessage,
        limit: 6,
      });

    /*
     * 11.5 DISCOVERY
     *
     * Si todavía falta información comercial,
     * Discovery tiene prioridad sobre objeciones
     * y sobre la generación genérica con Ollama.
     */

    if (
      commercialResult.success &&
      commercialResult.data.missingData.length > 0
    ) {

      const missing =
        commercialResult.data.missingData[0];

      const questions: Record<string, string> = {
        "producto o servicio":
          "¿Qué producto o servicio estás buscando?",

        "necesidad":
          "¿Qué necesitas resolver o qué uso le darás?",

        "cantidad":
          "¿Qué cantidad necesitas?",

        "requisitos":
          "¿Tienes algún requisito o característica específica que necesites?",

        "presupuesto":
          "¿Tienes un presupuesto aproximado para esta compra?",
      };

      const question =
        questions[missing];

      if (question) {
        return {
          success: true,
          text: question,
          provider: "commercial-intelligence",
          model: "deterministic",
          conversationId: context.conversationId,
          messageCount: context.messageCount,
          duration: commercialResult.duration,
        };
      }
    }

    /*
     * 11.6 MANEJO DE OBJECIONES
     *
     * Solo ejecutamos esta capa si Commercial Intelligence
     * pudo analizar correctamente la conversación.
     *
     * Si falla, continuamos con el flujo normal de Ollama.
     * Una falla comercial nunca debe romper la respuesta.
     */

    if (commercialResult.success) {

      const objectionResult =
        analyzeObjections(
          commercialResult.data,
        );

      if (
        objectionResult.hasObjection &&
        objectionResult.objections.length > 0
      ) {

        const objection =
          objectionResult.objections[
            objectionResult.objections.length - 1
          ];

        const objectionResponse =
          generateObjectionResponse(
            objection,
          );

        return {
          success: true,
          text: objectionResponse.text,
          provider: "objection-intelligence",
          model: "deterministic",
          conversationId: context.conversationId,
          messageCount: context.messageCount,
          duration: commercialResult.duration,
        };
      }
    }

    /*
     * RESPUESTA GENERAL
     *
     * Si no falta información comercial y no existe
     * una objeción detectada, continúa el flujo normal.
     */

    const history =
      context.messages
        .slice(-6)
        .map(
          message =>
            `${message.role === "user" ? "Cliente" : "Asistente"}: ${message.content}`,
        )
        .join("\n");

    const prompt = `
Eres el asistente comercial conversacional de CRM AI CORE.

Responde exclusivamente al MENSAJE ACTUAL del cliente.

REGLAS CRÍTICAS:

1. El mensaje actual tiene prioridad absoluta.
2. El historial solamente sirve para contexto.
3. Nunca copies información antigua si no corresponde al mensaje actual.
4. Nunca inventes datos.
5. Nunca conviertas información de una conversación anterior en información nueva.
6. Si existe contradicción entre historial y mensaje actual, utiliza el mensaje actual.
7. Responde siempre en español.
8. No uses portugués.
9. No menciones procesos internos, IA, prompts, workflows ni métricas.
10. No inventes productos, servicios, precios, cantidades, horarios ni condiciones.
11. Sé natural, profesional y conciso.
12. No vuelvas a preguntar algo que el cliente acaba de proporcionar.

CONTACTO:
${context.contactName ?? "Cliente"}

HISTORIAL RECIENTE:
${history || "Sin historial previo."}

MENSAJE ACTUAL:
${currentMessage}

Genera únicamente la respuesta que debe recibir el cliente.
`.trim();

    const response =
      await aiGateway.generate({
        prompt,
        temperature: 0.2,
        numPredict: 60,
      });

    return {
      success: response.success,
      text: response.text?.trim() ?? "",
      provider: response.provider,
      model: response.model,
      conversationId: context.conversationId,
      messageCount: context.messageCount,
      duration: response.duration,
      ...(response.error
        ? { error: response.error }
        : {}),
      ...(response.errorCode
        ? { errorCode: response.errorCode }
        : {}),
    };
  }
}

export const aiConversationRuntime =
  new AIConversationRuntime();
