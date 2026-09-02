import type { SubscriptionEntitlements } from "../types";

export type EntitlementKey =
  | "users"
  | "leads"
  | "ai_followups"
  | "automations"
  | "advanced_workflows"
  | "executive_intelligence"
  | "priority_support";

export interface EnforcementContext {
  organizationId: string;
  entitlement: SubscriptionEntitlements;
  currentUsage?: number;
}

export interface EnforcementResult {
  allowed: boolean;
  reason?: string;
  limit?: number;
  usage?: number;
}
