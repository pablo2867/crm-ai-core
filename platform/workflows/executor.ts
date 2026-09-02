import {
  skillEngine,
  SkillResult,
} from "@/platform/skills";

import {
  capabilityEngine,
} from "@/platform/capabilities";

import {
  activityService,
} from "@/platform/activity";


import type {
  Workflow,
  WorkflowContext,
  WorkflowExecutionStep,
  WorkflowResult,
} from "./types";

export class WorkflowExecutor {

  async execute(
    workflow: Workflow,
    context: WorkflowContext = {},
  ): Promise<WorkflowResult> {

    const workflowStartedAt =
      performance.now();

    const results: SkillResult[] = [];

    const execution:
      WorkflowExecutionStep[] = [];

    const userId =
      typeof context.userId === "string"
        ? context.userId
        : undefined;

    let workflowSuccess = true;

    try {

      for (const step of workflow.steps) {

        const startedAt =
          performance.now();

        let result: SkillResult;

        try {

          /*
          ---------------------------------------
          STEP INPUT
          ---------------------------------------

          Cada skill recibe:

          1. El contexto acumulado del workflow.
          2. El input específico del step.

          Esto permite que la salida de una skill
          se convierta en entrada de la siguiente.
          */

          const stepInput:
            WorkflowContext = {

            ...context,

            ...(step.input ?? {}),

          };
          /*
          ---------------------------------------
          Capability
          ---------------------------------------
          */

          if (step.capability) {

            const capabilityResult =
              await capabilityEngine.execute(

                step.capability,

                {

                  userId,

                  organizationId:
                    typeof context.organizationId ===
                    "string"
                      ? context.organizationId
                      : undefined,

                  workspaceId:
                    typeof context.workspaceId ===
                    "string"
                      ? context.workspaceId
                      : undefined,

                  workflowId:
                    workflow.id,

                  goal:
                    workflow.id,

                  input:
                    stepInput,

                },

              );

            result = {

              success:
                capabilityResult.success,

              message:
                capabilityResult.message,

              data:
                capabilityResult.data,

            };

          }

          /*
          ---------------------------------------
          Skill
          ---------------------------------------
          */

          else if (step.skill) {

            result =
              await skillEngine.executeSkill(

                step.skill,

                {

                  userId,

                  organizationId:
                    typeof context.organizationId ===
                    "string"
                      ? context.organizationId
                      : undefined,

                  workspaceId:
                    typeof context.workspaceId ===
                    "string"
                      ? context.workspaceId
                      : undefined,

                  input:
                    stepInput,

                },

              );

          }

          /*
          ---------------------------------------
          Invalid Step
          ---------------------------------------
          */

          else {

            result = {

              success: false,

              message:
                "Workflow step sin skill ni capability.",

            };

          }

        }

        catch (error) {

          result = {

            success: false,

            message:
              error instanceof Error
                ? error.message
                : "Workflow execution error.",

          };

        }

        const durationMs =
          Math.round(
            performance.now() -
            startedAt,
          );

        /*
        ---------------------------------------
        Execution Record
        ---------------------------------------
        */

        execution.push({

          skill:
            step.skill,

          capability:
            step.capability,

          success:
            result.success,

          message:
            result.message,

          data:
            result.data,

          durationMs,

        });

        results.push(result);

        /*
        ---------------------------------------
        Activity
        ---------------------------------------
        */

        if (userId) {

          await activityService.add({

            id:
              crypto.randomUUID(),

            userId,

            
            organizationId:
              typeof context.organizationId === "string"
                ? context.organizationId
                : "",

            workspaceId:
              typeof context.workspaceId === "string"
                ? context.workspaceId
                : "",workflow:
              workflow.id,

            skill:
              step.skill ??
              step.capability ??
              "unknown",

            status:
              result.success
                ? "success"
                : "error",

            message:
              result.message,

            createdAt:
              new Date(),

            durationMs,

            data:
              result.data,

          });

        }

        /*
        ---------------------------------------
        CONTEXT PROPAGATION
        ---------------------------------------

        La salida de cada skill se incorpora
        al contexto para el siguiente step.

        Ejemplo:

        find-best-lead
              ↓
        { bestLead }
              ↓
        context.bestLead
              ↓
        create-task
              ↓
        { task }
              ↓
        context.task
              ↓
        generate-followup
        */

        if (
          result.success &&
          result.data &&
          typeof result.data === "object"
        ) {

          Object.assign(
            context,
            result.data,
          );

        }

        /*
        ---------------------------------------
        STOP ON FAILURE
        ---------------------------------------
        */

        if (!result.success) {

          workflowSuccess =
            false;

          break;

        }

      }

    }

    finally {

      /*
      Hooks futuros:

      - Telemetry
      - Metrics
      - Runtime Events
      */

    }

    return {

      workflowId:
        workflow.id,

      workflowName:
        workflow.id,

      success:
        workflowSuccess,

      context,

      results,

      execution,

      totalDurationMs:
        Math.round(
          performance.now() -
          workflowStartedAt,
        ),

    };

  }

}

export const workflowExecutor =
  new WorkflowExecutor();




