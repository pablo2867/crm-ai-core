"use client";

import { useState }
from "react";

import { useRouter }
from "next/navigation";

import { supabase }
from "@/lib/supabase";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function signup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      setError(error.message);

      setLoading(false);

      return;

    }

    router.push("/dashboard");

    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center px-6 relative overflow-hidden text-white">

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">

        <div className="bg-[#111113]/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">

          <div className="mb-8 text-center">

            <p className="text-zinc-500 text-sm">
              CRM AI
            </p>

            <h1 className="text-4xl font-black mt-3">
              Crear Cuenta
            </h1>

            <p className="text-zinc-400 mt-3">
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
                bg-[#18181B]
                border border-zinc-700
                rounded-2xl
                px-5 py-4
                text-white
                outline-none
                focus:border-blue-500
              "
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
                bg-[#18181B]
                border border-zinc-700
                rounded-2xl
                px-5 py-4
                text-white
                outline-none
                focus:border-blue-500
              "
              required
            />

            {error && (

              <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-2xl px-4 py-3 text-sm">

                {error}

              </div>

            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                hover:opacity-90
                transition
                rounded-2xl
                py-4
                text-white
                font-bold
                text-lg
                shadow-xl
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