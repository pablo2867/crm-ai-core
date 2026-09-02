import {
  LeadIntelligenceResult,
} from "@/platform/intelligence";

import type {
  ExecutiveMemoryRecord,
} from "@/platform/memory/executive/types";

export interface DecisionContext {

  intent: string;

  userId?: string;

  leadId?: number;

  aiScore: number;

  probability: number;

  estimatedRevenue: number;

  pipelineStage?: string;

  lastActivityAt?: string;

  intelligence?: LeadIntelligenceResult;

  executiveMemory?: ExecutiveMemoryRecord | null;

  metadata: Record<string, unknown>;

}

export function createDecisionContext(

  input: Partial<DecisionContext>

): DecisionContext {

  return {

    intent:
      input.intent ?? "",

    userId:
      input.userId,

    leadId:
      input.leadId,

    aiScore:
      input.aiScore ?? 0,

    probability:
      input.probability ?? 0,

    estimatedRevenue:
      input.estimatedRevenue ?? 0,

    pipelineStage:
      input.pipelineStage,

    lastActivityAt:
      input.lastActivityAt,

    intelligence:
      input.intelligence,

    executiveMemory:
      input.executiveMemory ?? null,

    metadata:
      input.metadata ?? {},

  };

}