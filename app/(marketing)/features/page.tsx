import Link from "next/link";
export const metadata = {
  title: "Funcionalidades",
  description: "Conoce las funcionalidades de CRM AI CORE para ventas, leads, seguimiento, automatización e inteligencia artificial.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          CRM AI CORE
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Funcionalidades
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Conoce las capacidades de CRM AI CORE.
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
                <div className="mt-12 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">Gestión de leads</h2>
            <p className="mt-3 text-slate-300">
              Centraliza leads, información comercial, seguimiento y actividades.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">Inteligencia artificial</h2>
            <p className="mt-3 text-slate-300">
              Utiliza IA para analizar leads, generar seguimientos y apoyar decisiones comerciales.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">Automatización</h2>
            <p className="mt-3 text-slate-300">
              Ejecuta tareas y workflows comerciales desde una plataforma CRM SaaS.
            </p>
          </article>
        </div>
      </div>
      </section>
    </main>
  );
}



