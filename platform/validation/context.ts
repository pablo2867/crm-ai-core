import type {
  Workflow,
} from "@/platform/workflows";

import type {
  Lead,
} from "@/platform/domain/lead/types";

import type {
  ExecutiveMemoryRecord,
} from "@/platform/memory/executive/types";

export interface ValidationContext {

  userId?: string;

  workflow: Workflow;

  lead?: Lead;

  executiveMemory?:
    ExecutiveMemoryRecord | null;

  metadata:
    Record<string, unknown>;

}

export function createValidationContext(

  input: ValidationContext

): ValidationContext {

  return {

    userId:
      input.userId,

    workflow:
      input.workflow,

    lead:
      input.lead,

    executiveMemory:
      input.executiveMemory ?? null,

    metadata:
      input.metadata ?? {},

  };

}