import Link from "next/link";

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-zinc-400 hover:text-white">← CRM AI CORE</Link>
        <h1 className="mt-10 text-4xl font-black">Cancelaciones y Reembolsos</h1>
        <p className="mt-3 text-sm text-zinc-500">Última actualización: 10 de septiembre de 2026</p>

        <div className="mt-12 space-y-8 leading-8 text-zinc-300">
          <section><h2 className="text-2xl font-bold text-white">1. Cancelación</h2>
          <p className="mt-3">La cancelación deberá poder realizarse de forma sencilla y directa desde los mecanismos habilitados por CRM AI CORE.</p></section>

          <section><h2 className="text-2xl font-bold text-white">2. Renovación</h2>
          <p className="mt-3">Cuando exista renovación automática, se informarán claramente el monto, periodicidad y condiciones aplicables.</p></section>

          <section><h2 className="text-2xl font-bold text-white">3. Reembolsos</h2>
          <p className="mt-3">Las solicitudes serán atendidas conforme a las condiciones contratadas y a los derechos establecidos por la legislación aplicable.</p></section>

          <section><h2 className="text-2xl font-bold text-white">4. Comprobantes</h2>
          <p className="mt-3">La persona usuaria deberá conservar la confirmación o comprobante de cancelación de su suscripción.</p></section>
        </div>
      </div>
    </main>
  );
}
