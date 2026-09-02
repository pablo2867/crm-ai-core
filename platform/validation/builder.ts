import {
  createValidationContext,
} from "./context";

import type {
  ValidationContext,
} from "./context";

import type {
  Workflow,
} from "@/platform/workflows";

import type {
  Lead,
} from "@/platform/domain/lead/types";

import type {
  ExecutiveMemoryRecord,
} from "@/platform/memory/executive/types";

export interface ValidationContextInput {

  userId?: string;

  workflow: Workflow;

  lead?: Lead;

  executiveMemory?:
    ExecutiveMemoryRecord | null;

  metadata?: Record<string, unknown>;

}

export function buildValidationContext(

  input: ValidationContextInput

): ValidationContext {

  return createValidationContext({

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

  });

}