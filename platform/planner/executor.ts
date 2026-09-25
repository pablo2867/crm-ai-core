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

    console.log(
      "[AUTHORITY TRACE] PLANNER EXECUTOR INPUT",
      JSON.stringify(
        {
          execution: plan.execution.map(
            (step) => ({
              workflowId: step.workflowId,
              capabilityId: step.capabilityId,
              priority: step.priority,
            }),
          ),
        },
        null,
        2,
      ),
    );

    for (const step of plan.execution) {
      try {
        console.log(
          "[AUTHORITY TRACE] PLANNER → WORKFLOW PROVIDER",
          JSON.stringify(
            {
              workflowId: step.workflowId,
              capabilityId: step.capabilityId,
            },
            null,
            2,
          ),
        );

        let result: WorkflowResult;

        if (executeWorkflow) {
          console.log(
            "[AUTHORITY TRACE] PLANNER → CUSTOM WORKFLOW EXECUTOR",
            JSON.stringify(
              {
                workflowId: step.workflowId,
              },
              null,
              2,
            ),
          );

          result = await executeWorkflow(
            step,
            context,
          );
        } else {
          const workflow =
            workflowProvider.get(
              step.workflowId,
            );

          console.log(
            "[AUTHORITY TRACE] WORKFLOW PROVIDER RESULT",
            JSON.stringify(
              {
                requestedWorkflowId:
                  step.workflowId,

                resolvedWorkflowId:
                  workflow?.id ?? null,

                resolvedWorkflowName:
                  workflow?.name ?? null,

                found:
                  Boolean(workflow),
              },
              null,
              2,
            ),
          );

          if (!workflow) {
            console.error(
              "[AUTHORITY TRACE] WORKFLOW NOT FOUND",
              JSON.stringify(
                {
                  workflowId:
                    step.workflowId,
                },
                null,
                2,
              ),
            );

            return {
              success: false,
              executedSteps:
                completed.length,
              completed,
              failedStep:
                step.workflowId,
              results,
              plan,
            };
          }

          console.log(
            "[AUTHORITY TRACE] PLANNER → WORKFLOW ENGINE",
            JSON.stringify(
              {
                workflowId:
                  workflow.id,

                workflowName:
                  workflow.name,

                steps:
                  workflow.steps.map(
                    (workflowStep) => ({
                      id:
                        workflowStep.id,

                      skill:
                        workflowStep.skill ??
                        null,

                      capability:
                        workflowStep.capability ??
                        null,
                    }),
                  ),
              },
              null,
              2,
            ),
          );

          result =
            await workflowEngine.execute(
              workflow,
              context,
            );
        }

        console.log(
          "[AUTHORITY TRACE] WORKFLOW RESULT",
          JSON.stringify(
            {
              workflowId:
                result.workflowId,

              workflowName:
                result.workflowName,

              success:
                result.success,

              execution:
                result.execution,
            },
            null,
            2,
          ),
        );

        results.push(result);

        if (!result.success) {
          console.error(
            "[AUTHORITY TRACE] WORKFLOW FAILED",
            JSON.stringify(
              {
                workflowId:
                  step.workflowId,

                result,
              },
              null,
              2,
            ),
          );

          return {
            success: false,
            executedSteps:
              completed.length,
            completed,
            failedStep:
              step.workflowId,
            results,
            plan,
          };
        }

        completed.push(
          step.workflowId,
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        const errorStack =
          error instanceof Error
            ? error.stack
            : undefined;

        console.error(
          "[AUTHORITY TRACE] PLANNER EXECUTOR ERROR",
          JSON.stringify(
            {
              workflowId:
                step.workflowId,

              capabilityId:
                step.capabilityId,

              error:
                errorMessage,

              stack:
                errorStack,
            },
            null,
            2,
          ),
        );

        return {
          success: false,
          executedSteps:
            completed.length,
          completed,
          failedStep:
            step.workflowId,
          results,
          plan,
        };
      }
    }

    console.log(
      "[AUTHORITY TRACE] PLANNER EXECUTOR SUCCESS",
      JSON.stringify(
        {
          completed,
          executedSteps:
            completed.length,
        },
        null,
        2,
      ),
    );

    return {
      success: true,
      executedSteps:
        completed.length,
      completed,
      results,
      plan,
    };
  }
}

export const plannerExecutor =
  new PlannerExecutor();