"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function signup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    /*
    ---------------------------------------
    EMAIL CONFIRMATION
    ---------------------------------------
    */

    if (!data.session) {
      router.push(
        `/login?message=${encodeURIComponent(
          "Revisa tu correo para confirmar tu cuenta."
        )}`
      );

      return;
    }

    /*
    ---------------------------------------
    NUEVO USUARIO
    → ONBOARDING
    ---------------------------------------
    */

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090B] px-6 text-white">

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">

        <div className="rounded-3xl border border-zinc-800 bg-[#111113]/80 p-8 shadow-2xl backdrop-blur-xl">

          <div className="mb-8 text-center">

            <p className="text-sm font-semibold text-zinc-500">
              CRM AI CORE
            </p>

            <h1 className="mt-3 text-4xl font-black">
              Crear Cuenta
            </h1>

            <p className="mt-3 text-zinc-400">
              Regístrate para comenzar
            </p>

          </div>

          <form
            onSubmit={signup}
            className="space-y-4"
          >

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border border-zinc-700
                bg-[#18181B]
                px-5 py-4
                text-white
                outline-none
                focus:border-blue-500
              "
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                w-full
                rounded-2xl
                border border-zinc-700
                bg-[#18181B]
                px-5 py-4
                text-white
                outline-none
                focus:border-blue-500
              "
              autoComplete="new-password"
              minLength={6}
              required
            />

            {error && (
              <div className="rounded-2xl border border-red-500 bg-red-500/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                py-4
                text-lg
                font-bold
                text-white
                shadow-xl
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Creando..."
                : "Crear Cuenta"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
