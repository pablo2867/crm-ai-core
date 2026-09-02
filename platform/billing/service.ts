import {
  subscriptionRepository,
} from "./repository";

import type {
  CreateSubscriptionRequest,
  Subscription,
  SubscriptionEntitlements,
  UpdateSubscriptionRequest,
} from "./types";

export class BillingService {
  async createSubscription(
    request: CreateSubscriptionRequest
  ): Promise<Subscription> {
    return subscriptionRepository.create(
      request
    );
  }

  async getSubscription(
    organizationId: string
  ): Promise<Subscription | null> {
    return subscriptionRepository
      .findByOrganizationId(
        organizationId
      );
  }

  async updateSubscription(
    request: UpdateSubscriptionRequest
  ): Promise<Subscription> {
    return subscriptionRepository.update(
      request
    );
  }

  getEntitlements(
    plan: Subscription["plan"]
  ): SubscriptionEntitlements {
    switch (plan) {
      case "starter":
        return {
          plan,
          maxUsers: 1,
          maxLeads: 500,
          aiFollowupsPerMonth: 20,
          maxAutomations: 3,
          advancedWorkflows: false,
          executiveIntelligence: false,
          prioritySupport: false,
        };

      case "pro":
        return {
          plan,
          maxUsers: 5,
          maxLeads: 5000,
          aiFollowupsPerMonth: 100,
          maxAutomations: 20,
          advancedWorkflows: true,
          executiveIntelligence: true,
          prioritySupport: false,
        };

      case "business":
        return {
          plan,
          maxUsers: 15,
          maxLeads: 25000,
          aiFollowupsPerMonth: 500,
          maxAutomations: -1,
          advancedWorkflows: true,
          executiveIntelligence: true,
          prioritySupport: true,
        };

      default:
        return {
          plan: "free",
          maxUsers: 1,
          maxLeads: 100,
          aiFollowupsPerMonth: 5,
          maxAutomations: 1,
          advancedWorkflows: false,
          executiveIntelligence: false,
          prioritySupport: false,
        };
    }
  }
}

export const billingService =
  new BillingService();