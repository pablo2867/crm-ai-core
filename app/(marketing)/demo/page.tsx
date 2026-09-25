import Link from "next/link";
export const metadata = {
  title: "Demo",
  description: "Descubre cómo funciona CRM AI CORE y cómo la inteligencia artificial puede ayudarte a gestionar ventas y seguimiento.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          CRM AI CORE
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Demo
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Descubre cómo funciona CRM AI CORE.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
          >
            Comenzar
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-900"
          >
            Ver precios
          </Link>
                <div className="mt-12">
          <h2 className="text-2xl font-semibold">¿Qué puedes hacer con CRM AI CORE?</h2>
          <p className="mt-4 max-w-3xl text-slate-300">
            CRM AI CORE permite gestionar leads, analizar oportunidades, generar seguimientos
            y ejecutar automatizaciones comerciales mediante una plataforma SaaS con inteligencia artificial.
          </p>
        </div>
      </div>
      </section>
    </main>
  );
}



