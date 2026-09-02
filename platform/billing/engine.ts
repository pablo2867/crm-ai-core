import {
  billingService,
} from "./service";

import type {
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionEntitlements,
  UpdateSubscriptionRequest,
} from "./types";

export class BillingEngine {
  async create(
    request: CreateSubscriptionRequest
  ): Promise<Subscription> {
    return billingService.createSubscription(
      request
    );
  }

  async get(
    organizationId: string
  ): Promise<Subscription | null> {
    return billingService.getSubscription(
      organizationId
    );
  }

  async update(
    request: UpdateSubscriptionRequest
  ): Promise<Subscription> {
    return billingService.updateSubscription(
      request
    );
  }

  getEntitlements(
    plan: Subscription["plan"]
  ): SubscriptionEntitlements {
    return billingService.getEntitlements(
      plan
    );
  }
}

export const billingEngine =
  new BillingEngine();