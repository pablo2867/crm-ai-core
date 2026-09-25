import {
  conversationService,
} from "@/platform/services/conversations";

import {
  conversationMemoryService,
} from "@/platform/services/conversation-memory";

export interface ConversationMemoryEngineRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  limit?: number;
}

export interface ConversationMemoryEngineResult {
  success: boolean;
  conversationId: string;
  summary: string;
  facts: string[];
  preferences: string[];
  decisions: string[];
  messageCount: number;
  error?: string;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function isValidConversationText(text: string) {
  const value = text.trim();

  if (!value) {
    return false;
  }

  const technicalPatterns = [
    "WHATSAPP_INBOUND_MESSAGE_SAVED",
    "WHATSAPP_COMMERCIAL_STATE",
    "WHATSAPP_HUMAN_HANDOFF",
    "POST /api/",
    "GET /api/",
    "○ Compiling",
    "✓ Compiled",
    "application-code:",
    "next.js:",
    "webpack",
    "turbopack",
  ];

  return !technicalPatterns.some((pattern) =>
    value.includes(pattern),
  );
}

function extractPreferences(text: string): string[] {
  const results: string[] = [];

  const patterns = [
    /(?:prefiero|prefiere|preferimos)\s+([^.!?\n]+)/gi,
    /(?:me gusta|nos gusta)\s+([^.!?\n]+)/gi,
    /(?:no quiero|no queremos)\s+([^.!?\n]+)/gi,
    /(?:mi horario es|nuestro horario es)\s+([^.!?\n]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      if (match[1]) {
        results.push(match[1].trim());
      }
    }
  }

  return unique(results);
}

function extractDecisions(text: string): string[] {
  const results: string[] = [];

  const patterns = [
    /(?:decidí|decidimos|confirmo|confirmamos)\s+([^.!?\n]+)/gi,
    /(?:acepto|aceptamos)\s+([^.!?\n]+)/gi,
    /(?:quiero contratar|queremos contratar)\s+([^.!?\n]+)/gi,
    /(?:agendemos|agendar)\s+([^.!?\n]+)/gi,
    /(?:acordamos|queda acordado)\s+([^.!?\n]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      if (match[1]) {
        results.push(match[1].trim());
      }
    }
  }

  return unique(results);
}

function buildSummary(
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>,
): string {
  if (messages.length === 0) {
    return "Sin historial de conversación.";
  }

  const recentMessages = messages
    .filter((message) => isValidConversationText(message.content))
    .slice(-6);

  if (recentMessages.length === 0) {
    return "Sin historial comercial válido.";
  }

  const lines = recentMessages.map((message) => {
    const role = message.role === "user" ? "Cliente" : "IA";
    return `${role}: ${message.content.trim()}`;
  });

  return lines.join(" | ").slice(0, 2000);
}

export class ConversationMemoryEngine {
  async build(
    request: ConversationMemoryEngineRequest,
  ): Promise<ConversationMemoryEngineResult> {
    try {
      const messages = await conversationService.listMessages({
        conversationId: request.conversationId,
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        limit: Math.min(Math.max(request.limit ?? 50, 1), 100),
      });

      const normalizedMessages = messages
        .map((message) => ({
          role:
            message.direction === "inbound"
              ? ("user" as const)
              : ("assistant" as const),
          content: message.body ?? "",
        }))
        .filter((message) =>
          isValidConversationText(message.content),
        );

      const allText = normalizedMessages
        .map((message) => message.content)
        .join("\n");

      const facts = unique(
        normalizedMessages
          .filter((message) => message.role === "user")
          .map((message) => message.content.trim())
          .filter((message) => message.length > 0)
          .slice(-10),
      );

      const preferences = extractPreferences(allText);
      const decisions = extractDecisions(allText);
      const summary = buildSummary(normalizedMessages);

      await conversationMemoryService.persist({
        userId: request.userId,
        organizationId: request.organizationId,
        workspaceId: request.workspaceId,
        conversationId: request.conversationId,
        summary,
        facts,
        preferences,
        decisions,
      });

      return {
        success: true,
        conversationId: request.conversationId,
        summary,
        facts,
        preferences,
        decisions,
        messageCount: messages.length,
      };
    } catch (error) {
      return {
        success: false,
        conversationId: request.conversationId,
        summary: "",
        facts: [],
        preferences: [],
        decisions: [],
        messageCount: 0,
        error:
          error instanceof Error
            ? error.message
            : "CONVERSATION_MEMORY_ENGINE_FAILED",
      };
    }
  }
}

export const conversationMemoryEngine =
  new ConversationMemoryEngine();
