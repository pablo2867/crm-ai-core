import {
  agentDispatcher,
} from "@/platform/agents/dispatcher";

import {
  intents,
  workflows,
} from "@/platform/manifest";

import type {
  AgentRequest,
} from "@/platform/agents/contracts";

import type {
  CollaborationExecution,
  CollaborationRequest,
  CollaborationResult,
  CollaborationStep,
} from "./types";

export class CollaborationEngine {

  private resolveSteps(
    request: CollaborationRequest
  ): CollaborationStep[] {

    if (request.steps.length > 0) {

      return request.steps;

    }

    const intentId =
      String(request.context.intent ?? "");

    const intent =
      intents.find(
        (item) => item.id === intentId
      );

    if (!intent?.workflow) {

      return [];

    }

    const workflow =
      workflows.find(
        (item) => item.id === intent.workflow
      );

    if (!workflow) {

      return [];

    }

    return workflow.steps;

  }

  async execute(
    request: CollaborationRequest
  ): Promise<CollaborationResult> {

    const executions: CollaborationExecution[] = [];

    const steps =
      this.resolveSteps(
        request
      );

    for (const step of steps) {

      const startedAt =
        Date.now();

      const agentRequest: AgentRequest = {

        userId:
          typeof request.context.userId === "string"
            ? request.context.userId
            : undefined,

        message:
          typeof request.context.message === "string"
            ? request.context.message
            : "",

        intent:
          step.intent,

        context:
          request.context,

      };

      const result =
        await agentDispatcher.dispatch(
          agentRequest
        );

      const finishedAt =
        Date.now();

      executions.push({

        agentId:
          result.agent,

        success:
          result.success,

        result,

        startedAt,

        finishedAt,

        duration:
          finishedAt - startedAt,

      });

    }

    const successfulAgents =
      executions.filter(
        (item) => item.success
      ).length;

    const failedAgents =
      executions.length -
      successfulAgents;

    const totalDuration =
      executions.reduce(

        (total, item) =>

          total + item.duration,

        0

      );

    return {

      success:
        failedAgents === 0,

      executions,

      summary: {

        totalAgents:
          executions.length,

        successfulAgents,

        failedAgents,

        totalDuration,

      },

    };

  }

}

export const collaborationEngine =
  new CollaborationEngine();