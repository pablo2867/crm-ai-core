import {
  salesPlanner,
} from "./planner";

import type {
  SalesPlan,
} from "./planner";

import {
  salesMemory,
} from "./memory";

import {
  executiveMemoryEngine,
} from "@/platform/memory/executive/engine";

import type {
  WorkflowResult,
} from "@/platform/workflows";

import {
  plannerExecutor,
} from "@/platform/planner";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import type {
  CopilotIntent,
} from "@/platform/copilot/intent-resolver";

export interface SalesAgentContext {
  userId?: string;
  [key: string]: unknown;
}

export interface SalesAgentResponse {
  plan: SalesPlan;
  planning: unknown;
  workflow: unknown;

  skills: {
    bestLead?: unknown;
    leadRanking?: unknown;
    followup?: unknown;
    task?: unknown;
  };
}

function extractWorkflowOutputs(
  workflowResult?: WorkflowResult,
) {
  const skills: SalesAgentResponse["skills"] = {};

  for (const step of workflowResult?.execution ?? []) {

    if (
      !step.data ||
      typeof step.data !== "object"
    ) {
      continue;
    }

    const data =
      step.data as Record<string, unknown>;

    if (
      step.skill === "find-best-lead"
    ) {
      skills.bestLead =
        data.bestLead;
    }

    if (
      step.skill === "sales-lead-ranking"
    ) {
      skills.leadRanking =
        data.leads ?? step.data;
    }

    if (
      step.skill === "generate-followup"
    ) {
      skills.followup =
        data.followup ?? step.data;
    }

    if (
      step.skill === "create-task"
    ) {
      skills.task =
        data.task ?? step.data;
    }
  }

  return skills;
}

export class SalesAgent {

  async execute(
    request: AgentRequest,
  ): Promise<
    AgentResult<SalesAgentResponse>
  > {

    const context: SalesAgentContext = {
      ...(request.context ?? {}),

      userId:
        request.userId,

      organizationId:
        request.organizationId,

      workspaceId:
        request.workspaceId,
    };

    if (request.userId) {

      await salesMemory.add(
        request.userId,
        request.message,
      );

      await executiveMemoryEngine.save({
        userId: request.userId,
        workflow: "sales-agent",
        skill: "request",
        summary: request.message,
        priority: "MEDIUM",
        metadata: {
          intent: request.intent,
        },
      });
    }

    const intent: CopilotIntent = {
      intent: request.intent,
      confidence: 1,
    };

    const plan =
      await salesPlanner.createPlan(
        request.message,
        intent,
        request.userId,
        request.context,
      );

    const planning =
      await plannerExecutor.execute({
        plan:
          plan.executionPlan,
        context,
      });

    const workflowResult = planning.results[0] as WorkflowResult | undefined;

    const workflow =
      workflowResult ?? {
        workflowId:
          plan.workflow.id,

        workflowName:
          plan.workflow.name,

        success:
          planning.success,

        context,

        results:
          planning.results,

        execution: [],

        totalDurationMs: 0,

      } satisfies WorkflowResult;

    const skills =
      extractWorkflowOutputs(
        workflowResult,
      );

    if (request.userId) {

      await executiveMemoryEngine.save({
        userId: request.userId,

        workflow:
          plan.workflow.id,

        summary:
          `Workflow ejecutado: ${plan.workflow.name}`,

        recommendation:
          workflow.success
            ? "Workflow completado correctamente."
            : "Revisar la ejecución del workflow.",

        priority:
          workflow.success
            ? "LOW"
            : "HIGH",

        metadata: {
          planning,
          skills,
        },
      });
    }

    return {

      success:
        workflow.success,

      data: {

        plan,

        planning,

        workflow,

        skills,

      },

    };
  }
}

export const salesAgent =
  new SalesAgent();



