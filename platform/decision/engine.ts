import {
  workflowRegistry,
} from "@/platform/workflows/registry";

import {
  executiveMemoryEngine,
} from "@/platform/memory/executive/engine";

import {
  analyzeNextBestAction,
} from "@/platform/intelligence/next-best-action";

import {
  decisionExplanationEngine,
} from "./explanation";

import {
  matchWorkflows,
} from "./matcher";

import {
  scoreWorkflows,
} from "./scorer";

import {
  rankWorkflows,
} from "./ranker";

import {
  evaluateDecisionPolicy,
} from "./policy";

import {
  buildDecisionContext,
} from "./builder";

import type {
  DecisionRequest,
  DecisionResponse,
} from "./types";

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toStringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value
    : undefined;
}

function extractLead(context?: Record<string, unknown>) {
  const rawLead = context?.lead;

  if (
    !rawLead ||
    typeof rawLead !== "object" ||
    Array.isArray(rawLead)
  ) {
    return undefined;
  }

  const lead = rawLead as Record<string, unknown>;

  return {
    id: toNumber(lead.id),
    name: toStringValue(lead.name),
    company: toStringValue(lead.company),
    aiScore: toNumber(
      lead.aiScore ?? lead.ai_score,
    ),
    probability: toNumber(
      lead.probability ?? lead.close_probability,
    ),
    estimatedRevenue: toNumber(
      lead.estimatedRevenue ??
      lead.estimated_revenue,
    ),
    pipelineStage: toStringValue(
      lead.pipelineStage ??
      lead.pipeline_stage,
    ),
    temperature: toStringValue(
      lead.temperature ??
      lead.ai_temperature,
    ),
    lastActivityAt: toStringValue(
      lead.lastActivityAt ??
      lead.last_activity_at,
    ),
  };
}

function buildLeadContext(
  context?: Record<string, unknown>,
) {
  const nestedLead =
    extractLead(context);

  return {
    id:
      nestedLead?.id ??
      toNumber(context?.leadId),

    name:
      nestedLead?.name,

    company:
      nestedLead?.company,

    aiScore:
      nestedLead?.aiScore ??
      toNumber(
        context?.aiScore ??
        context?.ai_score,
      ),

    probability:
      nestedLead?.probability ??
      toNumber(
        context?.probability ??
        context?.close_probability,
      ),

    estimatedRevenue:
      nestedLead?.estimatedRevenue ??
      toNumber(
        context?.estimatedRevenue ??
        context?.estimated_revenue,
      ),

    pipelineStage:
      nestedLead?.pipelineStage ??
      toStringValue(
        context?.pipelineStage ??
        context?.pipeline_stage,
      ),

    temperature:
      nestedLead?.temperature ??
      toStringValue(
        context?.temperature ??
        context?.ai_temperature,
      ),

    lastActivityAt:
      nestedLead?.lastActivityAt ??
      toStringValue(
        context?.lastActivityAt ??
        context?.last_activity_at,
      ),
  };
}

export class DecisionEngine {

  async decide(
    request: DecisionRequest,
  ): Promise<DecisionResponse> {

    const workflows =
      workflowRegistry.getAll();

    const matches =
      matchWorkflows({
        intent:
          request.intent,

        workflows,
      });

    if (matches.length === 0) {

      throw new Error(
        `No hay workflows compatibles con el intent "${request.intent}".`,
      );

    }

    /*
    ---------------------------------------
    Executive Memory
    ---------------------------------------
    */

    const providedMemory =
      request.context?.executiveMemory;

    let latestMemory =
      providedMemory &&
      typeof providedMemory === "object"
        ? providedMemory
        : null;

    /*
    ---------------------------------------
    Compatibilidad
    ---------------------------------------
    */

    if (
      !latestMemory &&
      request.userId
    ) {

      latestMemory =
        await executiveMemoryEngine.latest(
          request.userId,
        );

    }

    /*
    ---------------------------------------
    Lead
    ---------------------------------------
    */

    const lead =
      buildLeadContext(
        request.context,
      );

    /*
    ---------------------------------------
    Decision Context
    ---------------------------------------
    */

    const context =
      buildDecisionContext({

        intent:
          request.intent,

        userId:
          request.userId,

        lead: {

          id:
            lead.id,

          aiScore:
            lead.aiScore,

          probability:
            lead.probability,

          estimatedRevenue:
            lead.estimatedRevenue,

          pipelineStage:
            lead.pipelineStage,

          lastActivityAt:
            lead.lastActivityAt,

        },

        executiveMemory:
          latestMemory as
            Parameters<
              typeof buildDecisionContext
            >[0]["executiveMemory"],

        metadata: {

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          moduleId:
            request.moduleId,

          lead,

          ...(request.context ?? {}),

          executiveMemory:
            latestMemory,
        },

      });

    /*
    ---------------------------------------
    Scoring
    ---------------------------------------
    */

    const scored =
      scoreWorkflows({

        workflows:
          matches,

        context,

      });

    const ranking =
      rankWorkflows(
        scored,
      );

    const workflow =
      ranking.winner.workflow;

    const capabilityId =
      workflow.metadata?.capabilityId;

    const finalScore =
      ranking.winner.score;

    /*
    ---------------------------------------
    Next Best Action
    ---------------------------------------
    */

    const nextBestAction =
      await analyzeNextBestAction({

        userId:
          request.userId,

        organizationId:
          request.organizationId,

        workspaceId:
          request.workspaceId,

        lead: {

          id:
            lead.id,

          name:
            lead.name,

          company:
            lead.company,

          aiScore:
            lead.aiScore,

          probability:
            lead.probability,

          estimatedRevenue:
            lead.estimatedRevenue,

          pipelineStage:
            lead.pipelineStage,

          temperature:
            lead.temperature,

          lastActivityAt:
            lead.lastActivityAt,

        },

        metadata: {

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

          moduleId:
            request.moduleId,

          intent:
            request.intent,

          workflowId:
            workflow.id,

          workflowName:
            workflow.name,

          workflowScore:
            finalScore,

          ...(request.context ?? {}),

        },

      });

    const confidence =
      ranking.metadata.confidence;

    /*
    ---------------------------------------
    Decision Policy
    ---------------------------------------
    */

    const decisionPolicy =
      evaluateDecisionPolicy(

        ranking.winner,

        ranking.ranking,

        confidence,

      );

    /*
    ---------------------------------------
    Ordered Scores
    ---------------------------------------
    */

    const orderedScores =
      ranking.ranking
        .map((item) =>
          scored.find(
            (score) =>
              score.workflow.id ===
              item.workflow.id,
          ),
        )
        .filter(
          (
            item,
          ): item is (typeof scored)[number] =>
            Boolean(item),
        );

    /*
    ---------------------------------------
    Explanation
    ---------------------------------------
    */

    const explanation =
      decisionExplanationEngine.explain({

        workflowId:
          workflow.id,

        workflowName:
          workflow.name,

        finalScore,

        confidence,

        intent:
          request.intent,

        selectedScore:
          finalScore,

        decisionContext:
          context.metadata,

        reasons: [

          {
            title:
              "Workflow Ranking",

            description:
              "El workflow obtuvo la mayor puntuación durante la evaluación.",

            weight:
              finalScore,
          },

          ...(latestMemory
            ? [
                {
                  title:
                    "Executive Memory",

                  description:
                    "Se encontró memoria ejecutiva del usuario y fue considerada durante la decisión.",

                  weight:
                    10,
                },
              ]
            : []),

          {
            title:
              "Intent Detection",

            description:
              `Intent detectado: ${request.intent}`,

            weight:
              5,
          },

          {
            title:
              "Next Best Action",

            description:
              nextBestAction.explanation,

            weight:
              nextBestAction
                .recommendation
                .confidence,
          },

        ],

      });

    return {

      workflow,

      workflowId:
        workflow.id,

      capabilityId,

      confidence,

      status:
        decisionPolicy.status,

      requiresReview:
        decisionPolicy.requiresReview,

      margin:
        decisionPolicy.margin,

      reason:
        decisionPolicy.reason,

      explanation,

      selectedScore:
        finalScore,

      nextBestAction,

      ranking:
        orderedScores,

      decisionContext:
        context,

    };

  }

}

export const decisionEngine =
  new DecisionEngine();
