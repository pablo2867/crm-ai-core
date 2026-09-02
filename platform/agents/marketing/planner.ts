import type {
  CopilotIntent,
} from "@/platform/copilot/intent-resolver";

import type {
  Workflow,
} from "@/platform/workflows";

import {
  decisionEngine,
} from "@/platform/decision";

import {
  planner,
} from "@/platform/planner";

import type {
  ExecutionPlan,
} from "@/platform/planner";

export interface MarketingPlan {

  objective: string;

  workflow: Workflow;

  executionPlan: ExecutionPlan;

}

export class MarketingPlanner {

  async createPlan(

    message: string,

    intent: CopilotIntent,

    userId?: string,

    context?: Record<string, unknown>

  ): Promise<MarketingPlan> {

    const decision =
      await decisionEngine.decide({

        message,

        intent: intent.intent,

        userId,

        context,

      });

    const executionPlan =
      planner.createPlan({

        message,

        intent: intent.intent,

        workflow:
          decision.workflow,

        userId,

        context,

      });

    return {

      objective: message,

      workflow:
        decision.workflow,

      executionPlan,

    };

  }

}

export const marketingPlanner =
  new MarketingPlanner();