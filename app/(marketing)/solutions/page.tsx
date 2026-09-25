import Link from "next/link";
export const metadata = {
  title: "Soluciones",
  description: "Soluciones inteligentes de CRM AI CORE para gestionar, automatizar y mejorar la operación comercial.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          CRM AI CORE
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Soluciones
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Soluciones inteligentes para gestionar y automatizar tu operación comercial.
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
            <h2 className="text-xl font-semibold">Ventas</h2>
            <p className="mt-3 text-slate-300">
              Organiza oportunidades, leads y seguimiento comercial en un solo sistema.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">Seguimiento</h2>
            <p className="mt-3 text-slate-300">
              Genera acciones de seguimiento apoyadas por inteligencia artificial.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-xl font-semibold">Automatización comercial</h2>
            <p className="mt-3 text-slate-300">
              Conecta procesos, workflows y capacidades de IA para reducir trabajo manual.
            </p>
          </article>
        </div>
      </div>
      </section>
    </main>
  );
}



