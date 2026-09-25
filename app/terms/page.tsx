import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-zinc-400 hover:text-white">← CRM AI CORE</Link>
        <h1 className="mt-10 text-4xl font-black">Términos y Condiciones</h1>
        <p className="mt-3 text-sm text-zinc-500">Última actualización: 10 de septiembre de 2026</p>

        <div className="mt-12 space-y-8 leading-8 text-zinc-300">
          <section><h2 className="text-2xl font-bold text-white">1. Aceptación</h2>
          <p className="mt-3">El uso de CRM AI CORE implica la aceptación de estos términos y de las políticas publicadas en la plataforma.</p></section>

          <section><h2 className="text-2xl font-bold text-white">2. Servicio</h2>
          <p className="mt-3">CRM AI CORE proporciona herramientas SaaS para gestión de clientes, leads, ventas, automatización e inteligencia artificial.</p></section>

          <section><h2 className="text-2xl font-bold text-white">3. Cuenta</h2>
          <p className="mt-3">La persona usuaria es responsable de proporcionar información correcta y mantener seguras sus credenciales.</p></section>

          <section><h2 className="text-2xl font-bold text-white">4. Suscripciones</h2>
          <p className="mt-3">Los planes, precios, periodicidad y características serán los mostrados al momento de contratar. Los cargos recurrentes requieren consentimiento expreso.</p></section>

          <section><h2 className="text-2xl font-bold text-white">5. Inteligencia artificial</h2>
          <p className="mt-3">Los resultados generados por IA son herramientas de apoyo y deben ser revisados por la persona usuaria antes de tomar decisiones comerciales.</p></section>

          <section><h2 className="text-2xl font-bold text-white">6. Datos del cliente</h2>
          <p className="mt-3">La organización usuaria conserva la responsabilidad sobre los datos que incorpora a la plataforma y sobre la legalidad de su tratamiento.</p></section>

          <section><h2 className="text-2xl font-bold text-white">7. Uso prohibido</h2>
          <p className="mt-3">No podrá utilizarse el servicio para actividades ilícitas, fraudulentas, abusivas o que vulneren derechos de terceros.</p></section>

          <section><h2 className="text-2xl font-bold text-white">8. Cambios</h2>
          <p className="mt-3">Las modificaciones relevantes a estos términos serán comunicadas de forma clara y se respetarán los derechos que correspondan a las personas consumidoras.</p></section>
        </div>
      </div>
    </main>
  );
}
