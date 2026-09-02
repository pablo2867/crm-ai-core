import {
  agentDispatcher,
} from "@/platform/agents/dispatcher";

import {
  collaborationEngine,
} from "@/platform/agents/collaboration";

import {
  telemetryEngine,
} from "@/platform/telemetry";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import type {
  TelemetryRecord,
} from "@/platform/telemetry";

export interface OrchestratorResult
  extends AgentResult {

  orchestrator: string;

  executionTime: number;

}

export class AgentOrchestrator {

  protected async beforeExecution(
    _request: AgentRequest
  ): Promise<void> {

    // Futuro:
    // Authentication
    // Tenant Validation
    // Runtime Hooks
    // Audit
    // Request Tracking

  }

  protected async afterExecution(
    _request: AgentRequest,
    _result: AgentResult
  ): Promise<void> {

    // Futuro:
    // Runtime History
    // AI Memory
    // Metrics
    // Executive Dashboard

  }

  protected shouldCollaborate(
    request: AgentRequest
  ): boolean {

    const collaborativeIntents = [

      "ceo.strategy",

      "ceo.dashboard",

      "business.analysis",

      "business.growth",

      "business.health",

    ];

    return collaborativeIntents.includes(
      request.intent
    );

  }

  protected buildResponse(
    result: AgentResult,
    executionTime: number
  ): OrchestratorResult {

    return {

      success: result.success,

      data: result.data,

      orchestrator: "AI CORE OS",

      executionTime,

    };

  }

  async execute(
    request: AgentRequest
  ): Promise<OrchestratorResult> {

    const started =
      new Date();

    await this.beforeExecution(
      request
    );

    const collaborated =
      this.shouldCollaborate(
        request
      );

    let result: AgentResult;

    if (collaborated) {

      const collaboration =
        await collaborationEngine.execute({

          context:
            request.context ?? {},

          steps: [],

        });

      result = {

        success:
          collaboration.success,

        data:
          collaboration,

      };

    } else {

      result =
        await agentDispatcher.dispatch(
          request
        );

    }

    const finished =
      new Date();

    const telemetryRecord: TelemetryRecord = {

      agentId:
        collaborated
          ? "collaboration"
          : request.intent,

      workflow:
        typeof request.context?.workflow === "string"
          ? request.context.workflow
          : undefined,

      intent:
        request.intent,

      startedAt:
        started,

      finishedAt:
        finished,

      duration:
        finished.getTime() -
        started.getTime(),

      success:
        result.success,

      tokens: 0,

      memoryReads: 0,

      memoryWrites: 0,

    };

    /*
    ---------------------------------------
    Telemetry
    (Memoria + Supabase)
    ---------------------------------------
    */

    if (request.userId) {

      await telemetryEngine.add(
        request.userId,
        telemetryRecord,
        request.organizationId!,
        request.workspaceId!
      );

    }

    await this.afterExecution(
      request,
      result
    );

    return this.buildResponse(

      result,

      finished.getTime() -
      started.getTime()

    );

  }

}

export const agentOrchestrator =
  new AgentOrchestrator();
