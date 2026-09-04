import type {
  BillingPlan,
  BillingInterval,
  SubscriptionStatus,
} from "@/platform/billing/types";

export interface CreatePaymentPlanRequest {
  plan: BillingPlan;
  reason: string;
  amount: number;
  interval: BillingInterval;
  currencyId: string;
  backUrl: string;
}

export interface PaymentPlanResult {
  providerPlanId: string;
  reason: string;
  amount: number;
  currencyId: string;
  frequency: number;
  frequencyType: string;
}

export interface CreatePaymentSubscriptionRequest {
  providerPlanId?: string;
  reason: string;
  externalReference: string;
  payerEmail: string;
  backUrl: string;
  cardTokenId: string;
}

export interface PaymentSubscriptionResult {
  providerSubscriptionId: string;
  status: SubscriptionStatus | string;
  payerEmail: string | null;
  reason: string | null;
}

export interface PaymentSubscriptionStatusResult {
  providerSubscriptionId: string;
  status: string;
}
