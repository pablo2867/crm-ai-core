import LegalLinks from "@/components/legal/LegalLinks";
import Link from "next/link";
import BillingCheckout from "@/components/billing/BillingCheckout";
import { createClient } from "@/lib/supabase-server";

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    price: 19,
    description:
      "Para comenzar a organizar y potenciar tus ventas.",
    features: [
      "1 usuario",
      "Hasta 500 leads",
      "Pipeline",
      "AI Copilot",
      "Lead Intelligence",
      "20 seguimientos IA / mes",
      "3 automatizaciones",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro",
    price: 49,
    description:
      "Para equipos que quieren vender con inteligencia.",
    popular: true,
    features: [
      "Hasta 5 usuarios",
      "Hasta 5,000 leads",
      "AI Copilot completo",
      "Lead Intelligence completo",
      "100 seguimientos IA / mes",
      "Email y WhatsApp IA",
      "Deal Coach",
      "Revenue Forecast",
      "20 automatizaciones",
      "Executive Intelligence",
    ],
  },
  {
    id: "business" as const,
    name: "Business",
    price: 99,
    description:
      "Para equipos comerciales en crecimiento.",
    features: [
      "Hasta 15 usuarios",
      "Hasta 25,000 leads",
      "Todas las funciones Pro",
      "500 seguimientos IA / mes",
      "Automatizaciones ilimitadas",
      "Workflows avanzados",
      "Executive Intelligence",
      "Soporte prioritario",
    ],
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <main className="min-h-screen bg-[#070708] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-black">
            CRM AI CORE
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold hover:bg-orange-400"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            CRM AI CORE
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-6xl">
            Elige el plan adecuado para tu equipo.
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Potencia tus ventas con CRM, inteligencia artificial,
            automatización y análisis comercial en una sola plataforma.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-3xl border p-8 ${
                plan.popular
                  ? "border-orange-500/50 bg-orange-500/[0.07]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-black">
                  MÁS POPULAR
                </div>
              )}

              <h2 className="text-2xl font-black">
                {plan.name}
              </h2>

              <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
                {plan.description}
              </p>

              <div className="mt-8">
                <span className="text-5xl font-black">
                  ${plan.price}
                </span>

                <span className="text-zinc-500">
                  {" "}MXN / mes
                </span>
              </div>

              <BillingCheckout
                plan={plan.id}
                planName={plan.name}
                amount={plan.price}
              />

              <div className="mt-8 border-t border-white/10 pt-7">
                <p className="mb-4 text-sm font-bold">
                  Incluye:
                </p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm text-zinc-300"
                    >
                      <span className="font-bold text-orange-400">
                        ✓
                      </span>

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-black md:text-4xl">
            Empieza a convertir más oportunidades.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            CRM AI CORE combina tus datos comerciales con inteligencia
            artificial para ayudarte a decidir qué hacer y cuándo hacerlo.
          </p>

          <Link
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-orange-500 px-7 py-4 font-bold hover:bg-orange-400"
          >
            Crear mi cuenta
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 text-sm text-zinc-500">
          <span>
            © {new Date().getFullYear()} CRM AI CORE
          </span>

          <Link href="/" className="hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </footer>
    
      <LegalLinks />
</main>
  );
}





