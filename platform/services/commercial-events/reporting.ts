import {
  commercialEventsRepository,
} from "@/platform/repositories/commercial-events";

import type {
  TenantContext,
} from "@/platform/tenant";

export interface CommercialReporting {
  signups: number;
  onboardings: number;
  checkouts: number;
  subscriptions: number;

  signupToOnboarding: number;
  onboardingToCheckout: number;
  checkoutToSubscription: number;
}

export class CommercialEventsReporting {

  async getReport(
    tenant: TenantContext,
  ): Promise<CommercialReporting> {

    const query = {
      userId: tenant.userId,
      organizationId: tenant.organizationId,
      workspaceId: tenant.workspaceId,
    };

    const [
      signups,
      onboardings,
      checkouts,
      subscriptions,
    ] = await Promise.all([
      commercialEventsRepository.findByEventName(
        query,
        "signup_completed",
      ),

      commercialEventsRepository.findByEventName(
        query,
        "onboarding_completed",
      ),

      commercialEventsRepository.findByEventName(
        query,
        "checkout_started",
      ),

      commercialEventsRepository.findByEventName(
        query,
        "subscription_created",
      ),
    ]);

    const signupCount = signups.length;
    const onboardingCount = onboardings.length;
    const checkoutCount = checkouts.length;
    const subscriptionCount = subscriptions.length;

    return {
      signups: signupCount,
      onboardings: onboardingCount,
      checkouts: checkoutCount,
      subscriptions: subscriptionCount,

      signupToOnboarding:
        signupCount > 0
          ? (onboardingCount / signupCount) * 100
          : 0,

      onboardingToCheckout:
        onboardingCount > 0
          ? (checkoutCount / onboardingCount) * 100
          : 0,

      checkoutToSubscription:
        checkoutCount > 0
          ? (subscriptionCount / checkoutCount) * 100
          : 0,
    };
  }
}

export const commercialEventsReporting =
  new CommercialEventsReporting();
