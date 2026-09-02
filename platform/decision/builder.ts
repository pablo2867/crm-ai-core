import {
  DecisionContext,
  createDecisionContext,
} from "./context";

import {
  LeadIntelligenceResult,
} from "@/platform/intelligence";

import type {
  ExecutiveMemoryRecord,
} from "@/platform/memory/executive/types";

export interface DecisionContextInput {

  intent: string;

  userId?: string;

  lead?: {

    id?: number;

    aiScore?: number;

    probability?: number;

    estimatedRevenue?: number;

    pipelineStage?: string;

    lastActivityAt?: string;

  };

  intelligence?:
    LeadIntelligenceResult | null;

  executiveMemory?:
    ExecutiveMemoryRecord | null;

  metadata?: Record<string, unknown>;

}

export function buildDecisionContext(
  input: DecisionContextInput
): DecisionContext {

  return createDecisionContext({

    intent:
      input.intent,

    userId:
      input.userId,

    leadId:
      input.lead?.id,

    aiScore:
      input.lead?.aiScore,

    probability:
      input.lead?.probability,

    estimatedRevenue:
      input.lead?.estimatedRevenue,

    pipelineStage:
      input.lead?.pipelineStage,

    lastActivityAt:
      input.lead?.lastActivityAt,

    intelligence:
      input.intelligence ?? undefined,

    executiveMemory:
      input.executiveMemory ?? null,

    metadata:
      input.metadata,

  });

}