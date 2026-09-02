import {
  planEnforcementService,
} from "./service";

import type {
  EnforcementContext,
  EnforcementResult,
  EntitlementKey,
} from "./types";

export class PlanEnforcementEngine {
  check(
    key: EntitlementKey,
    context: EnforcementContext
  ): EnforcementResult {
    return planEnforcementService.check(
      key,
      context
    );
  }
}

export const planEnforcementEngine =
  new PlanEnforcementEngine();
