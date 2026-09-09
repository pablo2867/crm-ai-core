"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();

  const [organizationName, setOrganizationName] =
    useState("");

  const [workspaceName, setWorkspaceName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setLoading(false);
    }

    checkSession();
  }, [router]);

  async function createWorkspace(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    const organization =
      organizationName.trim();

    const workspace =
      workspaceName.trim();

    if (!organization || !workspace) {
      setError(
        "Completa el nombre de la empresa y del espacio de trabajo."
      );
      return;
    }

    setCreating(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "La sesión no está disponible."
        );
      }

      const response = await fetch(
        "/api/onboarding",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            organizationName:
              organization,
            workspaceName:
              workspace,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ??
            "No fue posible configurar la cuenta."
        );
      }

      router.replace("/dashboard");
      router.refresh();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error durante la configuración."
      );

      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090B] text-white">
        <p className="text-zinc-400">
          Cargando...
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-6 text-white">

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">

        <div className="rounded-3xl border border-zinc-800 bg-[#111113]/90 p-8 shadow-2xl backdrop-blur-xl">

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold text-orange-400">
              CRM AI CORE
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Configura tu espacio
            </h1>

            <p className="mt-3 text-zinc-400">
              Estos datos crearán tu organización
              y tu espacio de trabajo.
            </p>

          </div>

          <form
            onSubmit={createWorkspace}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Nombre de la empresa
              </label>

              <input
                type="text"
                value={organizationName}
                onChange={(e) =>
                  setOrganizationName(
                    e.target.value
                  )
                }
                placeholder="Ej. Mi Empresa"
                className="
                  w-full
                  rounded-2xl
                  border border-zinc-700
                  bg-[#18181B]
                  px-5 py-4
                  text-white
                  outline-none
                  focus:border-orange-500
                "
                required
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-zinc-300">
                Nombre del espacio de trabajo
              </label>

              <input
                type="text"
                value={workspaceName}
                onChange={(e) =>
                  setWorkspaceName(
                    e.target.value
                  )
                }
                placeholder="Ej. Ventas"
                className="
                  w-full
                  rounded-2xl
                  border border-zinc-700
                  bg-[#18181B]
                  px-5 py-4
                  text-white
                  outline-none
                  focus:border-orange-500
                "
                required
              />

            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={creating}
              className="
                w-full
                rounded-2xl
                bg-orange-500
                py-4
                text-lg
                font-bold
                text-white
                transition
                hover:bg-orange-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {creating
                ? "Configurando..."
                : "Continuar al CRM"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
