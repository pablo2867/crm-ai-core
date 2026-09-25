import {
  aiConversationDecisionEngine,
} from "./decision";

import {
  decisionEngine,
} from "@/platform/decision";

import {
  workflowEngine,
} from "@/platform/workflows";

import type {
  ConversationDecision,
} from "./decision";

import type {
  DecisionResponse,
} from "@/platform/decision";

import type {
  WorkflowResult,
} from "@/platform/workflows";

export interface ConversationWorkflowRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;

  conversationId: string;
  contactPhone: string;
  contactName?: string | null;

  message: string;
  limit?: number;

  context?: Record<string, unknown>;
}

export interface ConversationWorkflowResult {
  success: boolean;

  conversationDecision: ConversationDecision;

  decision?: DecisionResponse;

  workflow?: WorkflowResult;

  requiresHuman: boolean;

  error?: string;
}

export class AIConversationWorkflowBridge {

  async execute(
    request: ConversationWorkflowRequest,
  ): Promise<ConversationWorkflowResult> {

    /*
     * ---------------------------------------
     * 1. CONVERSATION DECISION
     * ---------------------------------------
     *
     * La intención siempre debe salir del
     * Conversation Decision Engine.
     */

    const conversationDecision =
      await aiConversationDecisionEngine.decide({

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

        message:
          request.message,

        limit:
          request.limit,

      });

    /*
     * ---------------------------------------
     * 2. HUMAN HANDOFF
     * ---------------------------------------
     *
     * Una conversación marcada para humano
     * no debe entrar al Decision Engine ni
     * ejecutar un Workflow automático.
     */

    if (
      conversationDecision.requiresHuman
    ) {

      return {

        success: true,

        conversationDecision,

        requiresHuman: true,

      };

    }

    /*
     * ---------------------------------------
     * 3. GENERAL DECISION ENGINE
     * ---------------------------------------
     *
     * Aquí comienza la autoridad del Core
     * general de decisiones.
     */

    const decision =
      await decisionEngine.decide({

        message:
          request.message,

        intent:
          conversationDecision.intent,

        userId:
          request.userId,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        moduleId:
          "whatsapp",

        context: {

          conversationId:
            request.conversationId,

          contactPhone:
            request.contactPhone,

          contactName:
            request.contactName,

          conversationDecision,

          ...(request.context ?? {}),

        },

      });

    /*
     * ---------------------------------------
     * 4. WORKFLOW ENGINE
     * ---------------------------------------
     */

    const workflow =
      await workflowEngine.execute(

        decision.workflow,

        {

          userId:
            request.userId,

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          intent:
            conversationDecision.intent,

          message:
            request.message,

          conversationId:
            request.conversationId,

          contactPhone:
            request.contactPhone,

          contactName:
            request.contactName,

          conversationDecision,

          decision,

          ...(request.context ?? {}),

        },

      );

    return {

      success:
        workflow.success,

      conversationDecision,

      decision,

      workflow,

      requiresHuman: false,

    };

  }

}

export const aiConversationWorkflowBridge =
  new AIConversationWorkflowBridge();
