import Link from "next/link";

export default function AiPolicyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-zinc-400 hover:text-white">← CRM AI CORE</Link>
        <h1 className="mt-10 text-4xl font-black">Política de Uso de Inteligencia Artificial</h1>

        <div className="mt-12 space-y-8 leading-8 text-zinc-300">
          <section><h2 className="text-2xl font-bold text-white">1. Funciones de IA</h2>
          <p className="mt-3">CRM AI CORE utiliza inteligencia artificial para análisis de leads, seguimiento, generación de contenido, priorización y asistencia comercial.</p></section>

          <section><h2 className="text-2xl font-bold text-white">2. Resultados</h2>
          <p className="mt-3">Los resultados pueden contener errores. La IA no sustituye la revisión y decisión de la persona usuaria.</p></section>

          <section><h2 className="text-2xl font-bold text-white">3. Datos</h2>
          <p className="mt-3">El procesamiento de información mediante funciones de IA se realizará conforme al Aviso de Privacidad y a las condiciones del servicio.</p></section>

          <section><h2 className="text-2xl font-bold text-white">4. Uso responsable</h2>
          <p className="mt-3">La persona usuaria debe utilizar las funciones de IA de manera legal, responsable y respetando los derechos de las personas cuyos datos procese.</p></section>
        </div>
      </div>
    </main>
  );
}
