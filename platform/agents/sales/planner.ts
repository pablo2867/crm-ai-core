import type {
  CopilotIntent,
} from "@/platform/copilot/intent-resolver";

import {
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

export interface SalesPlan {

  objective: string;

  workflow: Workflow;

  executionPlan: ExecutionPlan;

}

export class SalesPlanner {

  async createPlan(

    message: string,

    intent: CopilotIntent,

    userId?: string,

    context?: Record<string, unknown>

  ): Promise<SalesPlan> {

    /*
    ---------------------------------------
    Decision Engine
    ---------------------------------------
    */

    const decision =
      await decisionEngine.decide({

        message,

        intent: intent.intent,

        userId,

        context,

      });

    /*
    ---------------------------------------
    Planner
    ---------------------------------------
    */

    const executionPlan =
      planner.createPlan({

        message,

        intent: intent.intent,

        workflow:
          decision.workflow,

        userId,

        context,

      });

    /*
    ---------------------------------------
    Sales Plan
    ---------------------------------------
    */

    return {

      objective: message,

      workflow: decision.workflow,

      executionPlan,

    };

  }

}

export const salesPlanner =
  new SalesPlanner();