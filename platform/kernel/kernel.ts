import {
  decisionEngine,
} from "@/platform/decision";

import {
  planner,
  plannerExecutor,
} from "@/platform/planner";

import type {
  WorkflowResult,
} from "@/platform/workflows";

import {
  validationEngine,
} from "@/platform/validation";

import {
  buildValidationContext,
} from "@/platform/validation/builder";

import {
  getLead,
} from "@/platform/services/lead-service";

import {
  contextEngine,
} from "@/platform/context";

import {
  memoryEngine,
} from "@/platform/memory";

import type {
  KernelRequest,
  KernelResponse,
} from "./types";

function buildDeterministicSummary(
  workflow: WorkflowResult | null,
  workflowName: string,
  planningSuccess: boolean,
): string {

  if (!planningSuccess) {

    return (
      `La ejecución del workflow "${workflowName}" no se completó correctamente.`
    );

  }

  if (!workflow) {

    return (
      `El workflow "${workflowName}" fue procesado correctamente.`
    );

  }

  const successfulSteps =
    workflow.execution.filter(
      step =>
        step.success
    );

  const failedSteps =
    workflow.execution.filter(
      step =>
        !step.success
    );

  const leadStep =
    successfulSteps.find(
      step =>
        step.skill ===
        "find-best-lead"
    );

  const taskStep =
    successfulSteps.find(
      step =>
        step.skill ===
        "create-task"
    );

  const followupStep =
    successfulSteps.find(
      step =>
        step.skill ===
        "generate-followup"
    );

  const leadData =
    leadStep?.data;

  const bestLead =
    leadData &&
    typeof leadData === "object"
      ? (
          leadData as Record<
            string,
            unknown
          >
        ).bestLead
      : undefined;

  const leadName =
    bestLead &&
    typeof bestLead === "object"
      ? (
          bestLead as Record<
            string,
            unknown
          >
        ).name
      : undefined;

  const parts: string[] = [];

  parts.push(
    planningSuccess
      ? `Workflow "${workflowName}" ejecutado correctamente.`
      : `Workflow "${workflowName}" ejecutado con errores.`
  );

  if (
    typeof leadName ===
    "string" &&
    leadName.trim()
  ) {

    parts.push(
      `Lead seleccionado: ${leadName}.`
    );

  }

  if (taskStep) {

    parts.push(
      "Tarea creada correctamente."
    );

  }

  if (followupStep) {

    parts.push(
      "Follow-up generado correctamente."
    );

  }

  if (failedSteps.length > 0) {

    parts.push(
      `${failedSteps.length} paso(s) presentaron errores.`
    );

  }

  return parts.join(" ");
}

export class AIKernel {

  async execute(
    request: KernelRequest
  ): Promise<KernelResponse> {

    /*
    ---------------------------------------
    Context Engine
    ---------------------------------------
    */

    const kernelTimingStartedAt = Date.now();

    const contextStartedAt = Date.now();

    const context =
      request.userId
        ? await contextEngine.build(
            request.userId
          )
        : null;

    /*
    ---------------------------------------
    Memory Engine
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Context:", Date.now() - contextStartedAt, "ms");

    const memoryStartedAt = Date.now();

    const memories =
      request.userId
        ? await memoryEngine.recall({
            userId:
              request.userId,
            limit:
              10,
          })
        : [];

    /*
    ---------------------------------------
    Explicit Lead
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Memory:", Date.now() - memoryStartedAt, "ms");

    const leadStartedAt = Date.now();

    const lead =
      request.userId &&
      request.leadId
        ? (
            (await getLead(
              request.leadId,
              request.userId,
              {
                organizationId:
                  request.organizationId,
                workspaceId:
                  request.workspaceId,
              }
            )) ?? undefined
          )
        : undefined;

    /*
    ---------------------------------------
    Decision Lead
    ---------------------------------------
    Explicit lead has priority.
    If there is no explicit lead,
    Context Engine bestLead is used.
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Lead lookup:", Date.now() - leadStartedAt, "ms");

    const decisionLead =
      lead ??
      context?.bestLead;

    const validationLead =
      lead ??
      (
        request.userId &&
        decisionLead
          ? (
              (await getLead(
                decisionLead.id,
                request.userId,
                {
                  organizationId:
                    request.organizationId,
                  workspaceId:
                    request.workspaceId,
                }
              )) ?? undefined
            )
          : undefined
      );

    /*
    ---------------------------------------
    Decision Engine
    ---------------------------------------
    */

    const decisionStartedAt = Date.now();

    let decision;

    try {

      decision =
        await decisionEngine.decide({

          message:
            request.message,

          intent:
            request.intent,

          userId:
            request.userId,

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          moduleId:
            request.moduleId,

          context: {

            ...request.context,

            /*
            ---------------------------------------
            Selected Lead
            ---------------------------------------
            */

            lead:
              decisionLead,

            /*
            ---------------------------------------
            Full CRM Context
            ---------------------------------------
            */

            context,

            /*
            ---------------------------------------
            Memories
            ---------------------------------------
            */

            memories,

          },

        });

    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : "Error desconocido en Decision Engine.";

      console.error(
        "KERNEL_DECISION_ERROR:",
        error
      );

      return {

        handled:
          false,

        decision:
          null as never,

        plan:
          null,

        workflow:
          null,

        validation:
          null,

        agent:
          null,

        summary: {

          success:
            false,

          provider:
            "decision",

          model:
            "decision-engine",

          text:
            message,

        },

      };

    }

    /*
    ---------------------------------------
    Validation Context
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Decision:", Date.now() - decisionStartedAt, "ms");

    const validationStartedAt = Date.now();

    const validationContext =
      buildValidationContext({

        userId:
          request.userId,

        workflow:
          decision.workflow,

        lead:
          validationLead,

        metadata: {

          ...request.context,
          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,


          context,

          memories,

          /*
          ---------------------------------------
          Decision Policy
          ---------------------------------------
          */

          decisionPolicy: {

            status:
              decision.status,

            requiresReview:
              decision.requiresReview,

            margin:
              decision.margin,

            reason:
              decision.reason,

            confidence:
              decision.confidence,

          },

        },

      });

    /*
    ---------------------------------------
    Validation Engine
    ---------------------------------------
    */

    console.log(
      "KERNEL_POLICY_BEFORE_VALIDATION:",
      JSON.stringify(
        validationContext.metadata.decisionPolicy,
        null,
        2
      )
    );
    console.log(
      "KERNEL_POLICY:",
      JSON.stringify(
        validationContext.metadata.decisionPolicy,
        null,
        2
      )
    );
    console.log("[KERNEL TIMING] Validation context:", Date.now() - validationStartedAt, "ms");

    const validationEngineStartedAt = Date.now();

    const validation =
      await validationEngine.validate({

        workflow:
          decision.workflow,

        context:
          validationContext,

      });

    /*
    ---------------------------------------
    Validation Failure
    ---------------------------------------
    */

    if (!validation.valid) {

      return {

        handled:
          false,

        decision,

        plan:
          null,

        workflow:
          null,

        validation,

        agent:
          null,

        summary: {

          success:
            false,

          provider:
            "validation",

          model:
            "validation-engine",

          text:
            validation.results

              .map(
                result =>
                  result.reason ?? ""
              )

              .filter(
                Boolean
              )

              .join("\n"),

        },

      };

    }

    /*
    ---------------------------------------
    Planner
    ---------------------------------------
    */

    const plannerStartedAt = Date.now();

    const plan =
      planner.createPlan({

        ...request,

        workflow:
          decision.workflow,

        context: {

          ...request.context,

          /*
          ---------------------------------------
          Selected Lead
          ---------------------------------------
          */

          lead:
            decisionLead,

          /*
          ---------------------------------------
          Full Context
          ---------------------------------------
          */

          context,

          /*
          ---------------------------------------
          Memories
          ---------------------------------------
          */

          memories,

        },

      });

    /*
    ---------------------------------------
    Planner Executor
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Planner:", Date.now() - plannerStartedAt, "ms");

    const executorStartedAt = Date.now();

    const planning =
      await plannerExecutor.execute({

        plan,

        context: {

          ...request.context,
          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,


          /*
          ---------------------------------------
          Selected Lead
          ---------------------------------------
          */

          lead:
            decisionLead,

          /*
          ---------------------------------------
          Full Context
          ---------------------------------------
          */

          context,

          /*
          ---------------------------------------
          Memories
          ---------------------------------------
          */

          memories,

          userId:
            request.userId,

          leadId:
            request.leadId,


          moduleId:
            request.moduleId,

        },

      });

    /*
    ---------------------------------------
    Workflow Result
    ---------------------------------------
    */

    console.log("[KERNEL TIMING] Planner Executor:", Date.now() - executorStartedAt, "ms");

    console.log("[KERNEL TIMING] TOTAL:", Date.now() - kernelTimingStartedAt, "ms");

    const workflow =
      (
        planning.results[0] as
          | WorkflowResult
          | undefined
      ) ?? null;

    /*
    ---------------------------------------
    Deterministic Kernel Summary
    ---------------------------------------
    The Kernel no longer calls Ollama
    merely to describe the execution.
    ---------------------------------------
    */

    const summaryText =
      buildDeterministicSummary(

        workflow,

        decision.workflow.name,

        planning.success,

      );

    const summary = {

      success:
        planning.success,

      provider:
        "kernel",

      model:
        "deterministic",

      text:
        summaryText,

    };

    /*
    ---------------------------------------
    Memory
    ---------------------------------------
    */

    if (request.userId) {

      await memoryEngine.remember({

        userId:
          request.userId,

        type:
          "kernel",

        title:
          decision.workflow.name,

        content:
          summary.text,

        metadata: {

          workflow:
            decision.workflow.id,

          intent:
            request.intent,

          leadId:
            request.leadId,

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          moduleId:
            request.moduleId,

          planningSuccess:
            planning.success,

        },

      });

    }

    /*
    ---------------------------------------
    Kernel Response
    ---------------------------------------
    */

    return {

      handled:
        planning.success,

      decision,

      plan,

      workflow,

      validation,

      agent:
        null,

      summary,

    };

  }

}

export const aiKernel =
  new AIKernel();










