import type {
  ValidationRule,
} from "./types";

import {
  DecisionPolicyRule,
} from "./rules/decision-policy";

import {
  LeadClosedRule,
} from "./rules/lead-closed";

import {
  DuplicateWorkflowRule,
} from "./rules/duplicate-workflow";

import {
  RecentFollowupRule,
} from "./rules/recent-followup";

import {
  PipelineStageRule,
} from "./rules/pipeline-stage";

import {
  RevenueRule,
} from "./rules/revenue";

import {
  PermissionRule,
} from "./rules/permission";

export class ValidationRegistry {

  private readonly rules: ValidationRule[] = [

    new DecisionPolicyRule(),

    new LeadClosedRule(),

    new DuplicateWorkflowRule(),

    new RecentFollowupRule(),

    new PipelineStageRule(),

    new RevenueRule(),

    new PermissionRule(),

  ];

  getAll(): ValidationRule[] {

    return [
      ...this.rules,
    ];

  }

}

export const validationRegistry =
  new ValidationRegistry();