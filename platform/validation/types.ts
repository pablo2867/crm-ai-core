import type {
  Workflow,
} from "@/platform/workflows";

import type {
  ValidationContext,
} from "./context";

export interface ValidationRequest {

  workflow: Workflow;

  context: ValidationContext;

}

export interface ValidationResult {

  valid: boolean;

  reason?: string;

  rule?: string;

  severity?:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

}

export interface ValidationEngineResult {

  valid: boolean;

  results: ValidationResult[];

}

export interface ValidationRule {

  id: string;

  validate(

    request: ValidationRequest

  ):
    | ValidationResult
    | Promise<ValidationResult>;

}