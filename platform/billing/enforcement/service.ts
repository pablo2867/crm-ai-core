import type {
  EnforcementContext,
  EnforcementResult,
  EntitlementKey,
} from "./types";

export class PlanEnforcementService {
  check(
    key: EntitlementKey,
    context: EnforcementContext
  ): EnforcementResult {
    const { entitlement } = context;
    const usage = context.currentUsage ?? 0;

    switch (key) {
      case "users": {
        const limit = entitlement.maxUsers;

        return {
          allowed: limit < 0 || usage < limit,
          limit,
          usage,
          reason:
            limit >= 0 && usage >= limit
              ? "USER_LIMIT_REACHED"
              : undefined,
        };
      }

      case "leads": {
        const limit = entitlement.maxLeads;

        return {
          allowed: limit < 0 || usage < limit,
          limit,
          usage,
          reason:
            limit >= 0 && usage >= limit
              ? "LEAD_LIMIT_REACHED"
              : undefined,
        };
      }

      case "ai_followups": {
        const limit =
          entitlement.aiFollowupsPerMonth;

        return {
          allowed: limit < 0 || usage < limit,
          limit,
          usage,
          reason:
            limit >= 0 && usage >= limit
              ? "AI_FOLLOWUP_LIMIT_REACHED"
              : undefined,
        };
      }

      case "automations": {
        const limit =
          entitlement.maxAutomations;

        return {
          allowed: limit < 0 || usage < limit,
          limit,
          usage,
          reason:
            limit >= 0 && usage >= limit
              ? "AUTOMATION_LIMIT_REACHED"
              : undefined,
        };
      }

      case "advanced_workflows":
        return {
          allowed:
            entitlement.advancedWorkflows,
          reason:
            entitlement.advancedWorkflows
              ? undefined
              : "ADVANCED_WORKFLOWS_NOT_INCLUDED",
        };

      case "executive_intelligence":
        return {
          allowed:
            entitlement.executiveIntelligence,
          reason:
            entitlement.executiveIntelligence
              ? undefined
              : "EXECUTIVE_INTELLIGENCE_NOT_INCLUDED",
        };

      case "priority_support":
        return {
          allowed:
            entitlement.prioritySupport,
          reason:
            entitlement.prioritySupport
              ? undefined
              : "PRIORITY_SUPPORT_NOT_INCLUDED",
        };
    }
  }
}

export const planEnforcementService =
  new PlanEnforcementService();
