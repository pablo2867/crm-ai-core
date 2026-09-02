export type BillingPlan =
  | "free"
  | "starter"
  | "pro"
  | "business";

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete";

export type BillingInterval =
  | "month"
  | "year";

export interface Subscription {
  id: string;
  organizationId: string;
  plan: BillingPlan;
  status: SubscriptionStatus;
  interval: BillingInterval;
  provider: string | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionRequest {
  organizationId: string;
  plan?: BillingPlan;
  status?: SubscriptionStatus;
  interval?: BillingInterval;
  provider?: string | null;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
}

export interface UpdateSubscriptionRequest {
  id: string;
  plan?: BillingPlan;
  status?: SubscriptionStatus;
  interval?: BillingInterval;
  provider?: string | null;
  providerCustomerId?: string | null;
  providerSubscriptionId?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionEntitlements {
  plan: BillingPlan;
  maxUsers: number;
  maxLeads: number;
  aiFollowupsPerMonth: number;
  maxAutomations: number;
  advancedWorkflows: boolean;
  executiveIntelligence: boolean;
  prioritySupport: boolean;
}