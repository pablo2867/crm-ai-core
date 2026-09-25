export default function LegalLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
      <a href="/terms" className="hover:underline">
        Términos y Condiciones
      </a>
      <a href="/privacy" className="hover:underline">
        Aviso de Privacidad
      </a>
      <a href="/refunds" className="hover:underline">
        Cancelaciones y Reembolsos
      </a>
      <a href="/ai-policy" className="hover:underline">
        Política de IA
      </a>
    </div>
  )
}
