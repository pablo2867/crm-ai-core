import { planEnforcementEngine } from "@/platform/billing/enforcement";
import { billingEngine } from "@/platform/billing";

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

    const organizationId =
      typeof context.organizationId === "string"
        ? context.organizationId
        : undefined;

    const workspaceId =
      typeof context.workspaceId === "string"
        ? context.workspaceId
        : undefined;

    /*
     * ---------------------------------------
     * ORIGINAL REQUEST CONTEXT
     * ---------------------------------------
     *
     * El Workflow Executor no debe perder
     * la intención ni el mensaje original.
     *
     * Estas propiedades permiten que una
     * capability reciba la misma intención
     * que fue detectada por Copilot / Runtime.
     */

    const requestIntent =
      typeof context.intent === "string"
        ? context.intent
        : undefined;

    const originalMessage =
      typeof context.message === "string"
        ? context.message
        : typeof context.question === "string"
          ? context.question
          : undefined;

    let workflowSuccess = true;

    /*
     * ---------------------------------------
     * SaaS Commercial Enforcement
     * ---------------------------------------
     *
     * Solo workflows marcados como advanced
     * requieren el entitlement correspondiente.
     */

    if (workflow.metadata?.advanced === true) {

      if (!organizationId) {

        throw new Error(
          "ORGANIZATION_ID_REQUIRED",
        );

      }

      const subscription =
        await billingEngine.get(
          organizationId,
        );

      if (!subscription) {

        throw new Error(
          "SUBSCRIPTION_NOT_FOUND",
        );

      }

      const entitlements =
        billingEngine.getEntitlements(
          subscription.plan,
        );

      const enforcement =
        planEnforcementEngine.check(
          "advanced_workflows",
          {
            organizationId,

            entitlement:
              entitlements,
          },
        );

      if (!enforcement.allowed) {

        throw new Error(
          enforcement.reason ??
            "ADVANCED_WORKFLOWS_NOT_INCLUDED",
        );

      }

    }

    try {

      for (const step of workflow.steps) {

        const startedAt =
          performance.now();

        let result: SkillResult;

        try {

          /*
           * ---------------------------------------
           * STEP INPUT
           * ---------------------------------------
           *
           * Cada step recibe:
           *
           * 1. El contexto original.
           * 2. El input específico del step.
           *
           * La salida de un step puede convertirse
           * en contexto para los siguientes.
           */

          const stepInput:
            WorkflowContext = {

            ...context,

            ...(step.input ?? {}),

          };

          /*
           * ---------------------------------------
           * CAPABILITY
           * ---------------------------------------
           */

          if (step.capability) {

            console.log(
              "[AUTHORITY TRACE] WORKFLOW → CAPABILITY",
              JSON.stringify({

                workflowId:
                  workflow.id,

                workflowName:
                  workflow.name,

                stepId:
                  step.id,

                capability:
                  step.capability,

                intent:
                  requestIntent,

                originalMessage:
                  originalMessage,

              })
            );

            const capabilityResult =
              await capabilityEngine.execute(
                step.capability,
                {

                  userId,

                  organizationId,

                  workspaceId,

                  workflowId:
                    workflow.id,

                  /*
                   * IMPORTANTE:
                   * conservar la intención original.
                   */

                  intent:
                    requestIntent,

                  /*
                   * IMPORTANTE:
                   * conservar el mensaje original.
                   *
                   * Solo usamos el workflow ID como
                   * fallback si no existe mensaje.
                   */

                  goal:
                    originalMessage ??
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
           * ---------------------------------------
           * SKILL
           * ---------------------------------------
           */

          else if (step.skill) {

            result =
              await skillEngine.executeSkill(
                step.skill,
                {

                  userId,

                  organizationId,

                  workspaceId,

                  input:
                    stepInput,

                },
              );

          }

          /*
           * ---------------------------------------
           * INVALID STEP
           * ---------------------------------------
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

          /*
           * ---------------------------------------
           * AUTHORITY TRACE
           * ---------------------------------------
           */

          console.error(
            "[AUTHORITY TRACE] WORKFLOW EXECUTION ERROR",
            JSON.stringify(
              {

                workflowId:
                  workflow.id,

                workflowName:
                  workflow.name,

                stepId:
                  step.id,

                capability:
                  step.capability ??
                  null,

                skill:
                  step.skill ??
                  null,

                intent:
                  requestIntent ??
                  null,

                originalMessage:
                  originalMessage ??
                  null,

                error:
                  error instanceof Error
                    ? error.message
                    : String(error),

                stack:
                  error instanceof Error
                    ? error.stack
                    : undefined,

              },
              null,
              2,
            ),
          );

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
         * ---------------------------------------
         * EXECUTION RECORD
         * ---------------------------------------
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
         * ---------------------------------------
         * ACTIVITY
         * ---------------------------------------
         */

        if (userId) {

          await activityService.add({

            id:
              crypto.randomUUID(),

            userId,

            organizationId:
              organizationId ??
              "",

            workspaceId:
              workspaceId ??
              "",

            workflow:
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
         * ---------------------------------------
         * CONTEXT PROPAGATION
         * ---------------------------------------
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
         * ---------------------------------------
         * STOP ON FAILURE
         * ---------------------------------------
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
       * Hooks futuros:
       *
       * - Telemetry
       * - Metrics
       * - Runtime Events
       */

    }

    return {

      workflowId:
        workflow.id,

      workflowName:
        workflow.name,

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





