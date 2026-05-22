export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-white overflow-hidden">

      <section className="relative px-6 py-24 md:px-12 lg:px-24">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-sm text-zinc-300 mb-8 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              AI CRM Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
              Convierte Leads
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                en Clientes
              </span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
              CRM inteligente con IA, pipeline visual, lead scoring automático,
              analytics enterprise y automatización moderna para equipos de ventas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <button className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-2xl px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-600/30">
                Comenzar Gratis
              </button>

              <button className="border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-300 rounded-2xl px-8 py-4 text-lg font-semibold">
                Ver Demo
              </button>

            </div>

            <div className="flex flex-wrap items-center gap-8 mt-12 text-zinc-500 text-sm">

              <div>
                ✔ Pipeline AI
              </div>

              <div>
                ✔ Drag & Drop
              </div>

              <div>
                ✔ Analytics Enterprise
              </div>

            </div>

          </div>

          <div className="relative">

            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />

            <div className="relative rounded-[32px] border border-zinc-800 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-xl">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />

              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">

                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6">
                  <p className="text-blue-100 text-sm">
                    Leads
                  </p>
                  <h3 className="text-4xl font-black mt-4">
                    248
                  </h3>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-green-600 to-green-800 p-6">
                  <p className="text-green-100 text-sm">
                    Conversión
                  </p>
                  <h3 className="text-4xl font-black mt-4">
                    74%
                  </h3>
                </div>

              </div>

              <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

                <div className="flex items-center justify-between mb-5">

                  <h3 className="text-xl font-bold">
                    Pipeline IA
                  </h3>

                  <span className="rounded-full bg-blue-500/20 text-blue-400 px-3 py-1 text-sm">
                    Live
                  </span>

                </div>

                <div className="space-y-4">

                  <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
                    <p className="font-semibold">
                      Juan Pablo Flores
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      AI Score: 91
                    </p>
                  </div>

                  <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
                    <p className="font-semibold">
                      Carlos Ruiz
                    </p>
                    <p className="text-zinc-500 text-sm mt-1">
                      AI Score: 84
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="px-6 py-24 md:px-12 lg:px-24 border-t border-zinc-900">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <p className="text-blue-400 font-semibold uppercase tracking-[0.3em] text-sm">
              Features
            </p>

            <h2 className="text-4xl md:text-6xl font-black mt-6">
              Todo tu negocio
              <span className="block text-zinc-500">
                impulsado por IA
              </span>
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-5xl mb-6">
                🤖
              </div>
              <h3 className="text-2xl font-bold mb-4">
                AI Lead Scoring
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Prioriza automáticamente leads con inteligencia artificial.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-5xl mb-6">
                📊
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Analytics
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Métricas enterprise en tiempo real para tu equipo.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-green-500/50 transition-all duration-300">
              <div className="text-5xl mb-6">
                ⚡
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Pipeline Visual
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Organiza leads con drag & drop moderno estilo HubSpot.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 hover:border-pink-500/50 transition-all duration-300">
              <div className="text-5xl mb-6">
                🔔
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Automatización
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Notificaciones, toasts y flujos inteligentes integrados.
              </p>
            </div>

          </div>

        </div>

      </section>

      <section className="px-6 py-24 md:px-12 lg:px-24 border-t border-zinc-900">

        <div className="max-w-6xl mx-auto text-center">

          <p className="text-blue-400 font-semibold uppercase tracking-[0.3em] text-sm">
            Pricing
          </p>

          <h2 className="text-4xl md:text-6xl font-black mt-6 mb-16">
            Planes simples
            <span className="block text-zinc-500">
              para crecer rápido
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10">
              <h3 className="text-2xl font-bold">
                Starter
              </h3>
              <p className="text-5xl font-black mt-6">
                $29
              </p>
              <p className="text-zinc-500 mt-2">
                /mes
              </p>
              <button className="w-full mt-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition py-4 font-semibold">
                Empezar
              </button>
            </div>

            <div className="rounded-3xl border-2 border-blue-500 bg-gradient-to-b from-blue-500/10 to-transparent p-10 scale-105 shadow-2xl shadow-blue-500/20">
              <div className="inline-flex rounded-full bg-blue-500/20 text-blue-400 px-4 py-1 text-sm mb-6">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold">
                Pro AI
              </h3>
              <p className="text-5xl font-black mt-6">
                $99
              </p>
              <p className="text-zinc-500 mt-2">
                /mes
              </p>
              <button className="w-full mt-10 rounded-2xl bg-blue-600 hover:bg-blue-700 transition py-4 font-semibold shadow-xl">
                Comenzar Ahora
              </button>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10">
              <h3 className="text-2xl font-bold">
                Enterprise
              </h3>
              <p className="text-5xl font-black mt-6">
                Custom
              </p>
              <p className="text-zinc-500 mt-2">
                escalable
              </p>
              <button className="w-full mt-10 rounded-2xl bg-zinc-900 hover:bg-zinc-800 transition py-4 font-semibold">
                Contactar
              </button>
            </div>

          </div>

        </div>

      </section>

      <section className="px-6 py-24 md:px-12 lg:px-24 border-t border-zinc-900">

        <div className="max-w-5xl mx-auto text-center rounded-[40px] border border-zinc-800 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 p-16">

          <h2 className="text-4xl md:text-6xl font-black leading-tight">
            Lleva tu equipo
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              al siguiente nivel
            </span>
          </h2>

          <p className="text-zinc-400 text-xl mt-8 max-w-3xl mx-auto leading-relaxed">
            Automatiza ventas, organiza leads y escala tu negocio con IA moderna.
          </p>

          <button className="mt-12 bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-2xl px-10 py-5 text-xl font-bold shadow-2xl shadow-blue-600/30">
            Iniciar Prueba Gratis
          </button>

        </div>

      </section>

    </main>
  );
}
