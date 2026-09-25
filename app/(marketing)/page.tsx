import LegalLinks from "@/components/legal/LegalLinks";
import Link from "next/link";

const features = [
  {
    title: "AI Sales Copilot",
    description:
      "Analiza tus oportunidades y te indica qué acción comercial realizar.",
  },
  {
    title: "Lead Intelligence",
    description:
      "Identifica y prioriza los leads con mayor potencial de conversión.",
  },
  {
    title: "AI Follow-Up",
    description:
      "Genera seguimientos personalizados para mantener activas tus oportunidades.",
  },
  {
    title: "Email & WhatsApp IA",
    description:
      "Crea mensajes comerciales listos para enviar en segundos.",
  },
  {
    title: "Deal Coach",
    description:
      "Obtén recomendaciones para avanzar cada oportunidad de venta.",
  },
  {
    title: "Revenue Forecast",
    description:
      "Obtén una visión inteligente del revenue potencial de tu pipeline.",
  },
  {
    title: "Automations & Workflows",
    description:
      "Automatiza tareas y procesos comerciales repetitivos.",
  },
  {
    title: "Executive Intelligence",
    description:
      "Obtén una visión ejecutiva del rendimiento comercial de tu negocio.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "Para comenzar a organizar y potenciar tus ventas.",
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
    name: "Pro",
    price: "$49",
    description: "Para equipos que quieren vender con inteligencia.",
    featured: true,
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
    name: "Business",
    price: "$99",
    description: "Para equipos comerciales en crecimiento.",
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

const faqs = [
  {
    question: "¿CRM AI CORE es solamente un CRM?",
    answer:
      "No. CRM AI CORE combina CRM, inteligencia comercial, IA, automatización y workflows para ayudarte a decidir y ejecutar tus siguientes acciones de venta.",
  },
  {
    question: "¿Necesito experiencia en IA?",
    answer:
      "No. Las funciones de IA están integradas directamente en la plataforma para que puedas utilizarlas desde tu flujo comercial.",
  },
  {
    question: "¿Puedo trabajar con un equipo?",
    answer:
      "Sí. Los planes superiores permiten incorporar varios usuarios dentro de la organización.",
  },
  {
    question: "¿Puedo cancelar mi suscripción?",
    answer:
      "Sí. La suscripción podrá gestionarse desde tu cuenta.",
  },
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#070708] text-white">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070708]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-black tracking-tight"
          >
            CRM AI CORE
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
            <a href="#features" className="hover:text-white">
              Funciones
            </a>
            <a href="#how-it-works" className="hover:text-white">
              Cómo funciona
            </a>
            <a href="#pricing" className="hover:text-white">
              Precios
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-zinc-300 hover:text-white sm:block"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.15),transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400">
              Inteligencia comercial impulsada por IA
            </div>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Convierte tus leads en más ventas con IA.
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
              CRM inteligente que analiza tus oportunidades, prioriza tus
              mejores leads y te indica qué hacer para avanzar cada venta.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white transition hover:bg-orange-400"
              >
                Comenzar gratis
              </Link>

              <a
                href="#how-it-works"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-bold text-white transition hover:bg-white/10"
              >
                Ver cómo funciona
              </a>
            </div>

            <p className="mt-5 text-sm text-zinc-600">
              No necesitas ser experto en IA.
            </p>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATOR */}
      <section className="border-y border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            El nuevo CRM comercial
          </p>

          <h2 className="mt-5 text-3xl font-black md:text-5xl">
            No solo administra tus ventas.
            <br />
            <span className="text-orange-400">
              Te ayuda a vender.
            </span>
          </h2>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            Cómo funciona
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            De datos a acciones comerciales.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          {[
            ["01", "Leads"],
            ["02", "IA analiza"],
            ["03", "Oportunidades"],
            ["04", "IA prioriza"],
            ["05", "Next Best Action"],
            ["06", "Venta"],
          ].map(([number, title]) => (
            <div
              key={number}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="text-sm font-bold text-orange-400">
                {number}
              </span>

              <h3 className="mt-4 font-bold">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="border-y border-white/10 bg-[#0b0b0d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Todo conectado
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Inteligencia comercial en un solo lugar.
            </h2>

            <p className="mt-5 text-lg leading-8 text-zinc-400">
              CRM AI CORE conecta tus datos, inteligencia, decisiones y
              acciones dentro del mismo flujo comercial.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-orange-500/30 hover:bg-white/[0.05]"
              >
                <div className="mb-6 h-2 w-10 rounded-full bg-orange-500" />

                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFIT */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 rounded-[2rem] border border-orange-500/20 bg-orange-500/[0.06] p-8 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Una nueva forma de vender
            </p>

            <h2 className="mt-5 text-4xl font-black md:text-5xl">
              Deja de perseguir todos tus leads.
            </h2>
          </div>

          <div className="flex items-center">
            <p className="text-lg leading-8 text-zinc-300">
              Concéntrate en las oportunidades que realmente pueden
              convertirse en ventas. CRM AI CORE analiza tu pipeline y
              convierte la información comercial en acciones concretas.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="border-y border-white/10 bg-[#0b0b0d]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
              Precios
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Elige el plan para tu equipo.
            </h2>

            <p className="mt-5 text-zinc-400">
              Empieza con lo necesario y escala conforme crece tu operación.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded-3xl border p-8 ${
                  plan.featured
                    ? "border-orange-500/50 bg-orange-500/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-orange-500 px-3 py-1 text-xs font-black">
                    MÁS POPULAR
                  </div>
                )}

                <h3 className="text-2xl font-black">
                  {plan.name}
                </h3>

                <p className="mt-3 min-h-12 text-sm text-zinc-400">
                  {plan.description}
                </p>

                <div className="mt-8">
                  <span className="text-5xl font-black">
                    {plan.price}
                  </span>

                  <span className="text-zinc-500">
                    {" "}
                    / mes
                  </span>
                </div>

                <Link
                  href="/signup"
                  className={`mt-8 block rounded-xl px-5 py-3 text-center font-bold ${
                    plan.featured
                      ? "bg-orange-500 hover:bg-orange-400"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  Comenzar
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm text-zinc-300"
                    >
                      <span className="text-orange-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            FAQ
          </p>

          <h2 className="mt-4 text-4xl font-black">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <summary className="cursor-pointer list-none font-bold">
                {faq.question}
              </summary>

              <p className="mt-4 leading-7 text-zinc-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center">
          <h2 className="text-4xl font-black md:text-6xl">
            Empieza a vender con inteligencia.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Convierte tus datos comerciales en decisiones y acciones que
            ayuden a tu equipo a cerrar más oportunidades.
          </p>

          <Link
            href="/signup"
            className="mt-10 inline-block rounded-2xl bg-orange-500 px-8 py-4 font-black transition hover:bg-orange-400"
          >
            Comenzar con CRM AI CORE
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} CRM AI CORE
          </span>

          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white">
              Iniciar sesión
            </Link>

            <Link href="/signup" className="hover:text-white">
              Crear cuenta
            </Link>
          </div>
        </div>
      </footer>
    
      <LegalLinks />
</main>
  );
}


