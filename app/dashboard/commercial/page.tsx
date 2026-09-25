import { authEngine } from "@/platform/auth";
import {
  commercialEventsReporting,
} from "@/platform/services/commercial-events";

import CommercialDashboard from "@/components/commercial/CommercialDashboard";

export const dynamic = "force-dynamic";

export default async function CommercialPage() {
  const tenant =
    await authEngine.getTenant();

  const report =
    await commercialEventsReporting.getReport(
      tenant,
    );

  return (
    <CommercialDashboard
      signups={report.signups}
      onboardings={report.onboardings}
      checkouts={report.checkouts}
      subscriptions={report.subscriptions}
      signupToOnboarding={report.signupToOnboarding}
      onboardingToCheckout={report.onboardingToCheckout}
      checkoutToSubscription={report.checkoutToSubscription}
    />
  );
}
