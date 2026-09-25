"use client";

interface CommercialDashboardProps {
  signups: number;
  onboardings: number;
  checkouts: number;
  subscriptions: number;
  signupToOnboarding: number;
  onboardingToCheckout: number;
  checkoutToSubscription: number;
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#111116] p-6">
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-4xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function ConversionCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-[#111116] p-6">
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">
        {value.toFixed(1)}%
      </p>
    </div>
  );
}

export default function CommercialDashboard({
  signups,
  onboardings,
  checkouts,
  subscriptions,
  signupToOnboarding,
  onboardingToCheckout,
  checkoutToSubscription,
}: CommercialDashboardProps) {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white lg:pl-[280px]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">

        <div className="mb-10">
          <p className="text-sm font-medium text-zinc-500">
            Commercial Tracking
          </p>

          <h1 className="mt-2 text-4xl font-black">
            Commercial Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Seguimiento del recorrido comercial desde el registro
            hasta la creación de la suscripción.
          </p>
        </div>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Signups"
            value={signups}
          />

          <MetricCard
            label="Onboardings"
            value={onboardings}
          />

          <MetricCard
            label="Checkouts"
            value={checkouts}
          />

          <MetricCard
            label="Subscriptions"
            value={subscriptions}
          />
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Conversion Funnel
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Conversión entre las etapas comerciales registradas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <ConversionCard
              label="Signup - Onboarding"
              value={signupToOnboarding}
            />

            <ConversionCard
              label="Onboarding - Checkout"
              value={onboardingToCheckout}
            />

            <ConversionCard
              label="Checkout - Subscription"
              value={checkoutToSubscription}
            />
          </div>
        </section>

      </div>
    </main>
  );
}
