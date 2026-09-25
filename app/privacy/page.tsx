import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link href="/" className="text-zinc-400 hover:text-white">← CRM AI CORE</Link>
        <h1 className="mt-10 text-4xl font-black">Aviso de Privacidad</h1>
        <p className="mt-3 text-sm text-zinc-500">Última actualización: 10 de septiembre de 2026</p>

        <div className="mt-12 space-y-8 leading-8 text-zinc-300">
          <section><h2 className="text-2xl font-bold text-white">1. Responsable</h2>
          <p className="mt-3">[RAZÓN SOCIAL O NOMBRE DEL RESPONSABLE]. Domicilio: [DOMICILIO]. Contacto: [CORREO LEGAL]. Estos datos deberán completarse antes del lanzamiento comercial.</p></section>

          <section><h2 className="text-2xl font-bold text-white">2. Datos tratados</h2>
          <p className="mt-3">Podrán tratarse datos de identificación, contacto, cuenta, organización, facturación y la información comercial que la organización usuaria incorpore a la plataforma.</p></section>

          <section><h2 className="text-2xl font-bold text-white">3. Finalidades</h2>
          <p className="mt-3">Los datos se utilizan para crear y administrar cuentas, prestar el servicio, gestionar suscripciones, proporcionar soporte, ejecutar funcionalidades y proteger la plataforma.</p></section>

          <section><h2 className="text-2xl font-bold text-white">4. Datos sensibles</h2>
          <p className="mt-3">No se solicitan datos personales sensibles como requisito ordinario para utilizar CRM AI CORE. Si una organización incorpora información sensible de terceros, será responsable de contar con la base legal correspondiente.</p></section>

          <section><h2 className="text-2xl font-bold text-white">5. Derechos ARCO</h2>
          <p className="mt-3">La persona titular podrá solicitar acceso, rectificación, cancelación u oposición conforme a la legislación aplicable, mediante [CORREO LEGAL / MECANISMO ARCO].</p></section>

          <section><h2 className="text-2xl font-bold text-white">6. Proveedores</h2>
          <p className="mt-3">El servicio puede utilizar proveedores tecnológicos para infraestructura, autenticación, almacenamiento, inteligencia artificial y procesamiento de pagos.</p></section>

          <section><h2 className="text-2xl font-bold text-white">7. Cambios al aviso</h2>
          <p className="mt-3">Las modificaciones serán comunicadas mediante los medios establecidos por el responsable.</p></section>
        </div>
      </div>
    </main>
  );
}
