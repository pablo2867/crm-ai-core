import type {
  ExecutionPlan,
  ExecutionStep,
} from "./types";

import type {
  WorkflowContext,
  WorkflowResult,
} from "@/platform/workflows";

import {
  workflowEngine,
} from "@/platform/workflows";

import {
  workflowProvider,
} from "@/platform/workflow-provider";

export interface PlannerExecutionRequest {
  plan: ExecutionPlan;

  context: WorkflowContext;

  // Compatibilidad con implementaciones anteriores.
  executeWorkflow?: (
    step: ExecutionStep,
    context: WorkflowContext,
  ) => Promise<WorkflowResult>;
}

export interface PlannerExecutionResult {
  success: boolean;

  executedSteps: number;

  completed: string[];

  failedStep?: string;

  results: unknown[];

  plan: ExecutionPlan;
}

export class PlannerExecutor {
  async execute(
    request: PlannerExecutionRequest,
  ): Promise<PlannerExecutionResult> {
    const completed: string[] = [];
    const results: unknown[] = [];

    const {
      plan,
      context,
      executeWorkflow,
    } = request;

    for (const step of plan.execution) {
      try {
        let result: WorkflowResult;

        if (executeWorkflow) {
          result = await executeWorkflow(
            step,
            context,
          );
        } else {
          const workflow =
            workflowProvider.get(
              step.workflowId,
            );

          if (!workflow) {
            return {
              success: false,
              executedSteps: completed.length,
              completed,
              failedStep: step.workflowId,
              results,
              plan,
            };
          }

          result =
            await workflowEngine.execute(
              workflow,
              context,
            );
        }

        results.push(result);

        if (!result.success) {
          return {
            success: false,
            executedSteps: completed.length,
            completed,
            failedStep: step.workflowId,
            results,
            plan,
          };
        }

        completed.push(step.workflowId);
      } catch {
        return {
          success: false,
          executedSteps: completed.length,
          completed,
          failedStep: step.workflowId,
          results,
          plan,
        };
      }
    }

    return {
      success: true,
      executedSteps: completed.length,
      completed,
      results,
      plan,
    };
  }
}

export const plannerExecutor =
  new PlannerExecutor();