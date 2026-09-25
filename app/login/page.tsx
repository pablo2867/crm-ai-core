"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    console.log("INTENTANDO LOGIN");

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("RESULTADO LOGIN:", result);

    const { data, error } = result;

    console.log("SESSION:", data?.session);
    console.log("USER:", data?.user);

    if (error) {
      console.error("ERROR LOGIN:", error);

      alert(error.message);

      return;
    }

    console.log("LOGIN EXITOSO");

    alert("LOGIN OK");

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#09090B] px-6">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md min-w-0">
        <div className="w-full rounded-3xl border border-zinc-800 bg-[#111113]/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="text-sm text-zinc-500">
              CRM AI
            </p>

            <h1 className="mt-3 text-4xl font-black text-white">
              Welcome Back
            </h1>

            <p className="mt-3 text-zinc-400">
              Inicia sesión para continuar
            </p>
          </div>

          <form
            onSubmit={login}
            className="w-full space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="block w-full rounded-2xl border border-zinc-700 bg-[#18181B] px-5 py-4 text-white outline-none focus:border-blue-500"
              autoComplete="email"
              required
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="block w-full rounded-2xl border border-zinc-700 bg-[#18181B] px-5 py-4 pr-14 text-white outline-none focus:border-blue-500"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.58 10.58a2 2 0 102.83 2.83"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 5.09A10.94 10.94 0 0112 4.88c5.23 0 8.69 4.5 9.5 7.12"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.61 6.61C4.85 7.8 3.55 9.48 2.5 12c.81 2.62 4.27 7.12 9.5 7.12 1.34 0 2.58-.25 3.69-.69"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-lg font-bold text-white shadow-xl transition hover:opacity-90"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
