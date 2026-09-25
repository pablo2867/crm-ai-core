import Link from "next/link";
export const metadata = {
  title: "Contacto",
  description: "Contacta con el equipo de CRM AI CORE y conoce cómo podemos ayudarte.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          CRM AI CORE
        </p>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Contacto
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Contacta con el equipo de CRM AI CORE.
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
        </div>
      </section>
    </main>
  );
}


