"use client";

import { useState } from "react";

export default function AIEmailGenerator() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function generateEmail(
    type: "followup" | "reactivation" | "closing"
  ) {
    try {
      setLoading(true);

      const dashboardResponse = await fetch(
        "/api/copilot-dashboard",
        { cache: "no-store" }
      );

      const dashboard = await dashboardResponse.json();

      if (!dashboard.success) {
        setEmail("No fue posible obtener el lead.");
        return;
      }

      const response = await fetch(
        "/api/email-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lead: dashboard.bestLead,
            type,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setEmail(data.email);
      } else {
        setEmail("No fue posible generar email.");
      }
    } catch (err) {
      console.error(err);
      setEmail("Error generando email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      bg-gradient-to-br
      from-indigo-500/10
      to-violet-500/10
      border
      border-indigo-500/20
      rounded-3xl
      p-6
      mb-8
    ">
      <p className="text-indigo-400 text-sm">
        AI Email Generator
      </p>

      <h2 className="text-2xl font-black mt-3">
        Generador de Emails
      </h2>

      <div className="
        flex
        flex-wrap
        gap-3
        mt-5
      ">
        <button
          onClick={() => generateEmail("followup")}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-indigo-500
            text-white
            font-semibold
          "
        >
          Seguimiento
        </button>

        <button
          onClick={() => generateEmail("reactivation")}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-violet-500
            text-white
            font-semibold
          "
        >
          Reactivación
        </button>

        <button
          onClick={() => generateEmail("closing")}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-emerald-500
            text-white
            font-semibold
          "
        >
          Cierre
        </button>
      </div>

      {loading && (
        <p className="mt-5 text-zinc-400">
          Generando email...
        </p>
      )}

      {email && (
        <div className="
          mt-6
          p-4
          rounded-2xl
          bg-black/30
          whitespace-pre-wrap
          text-zinc-300
        ">
          {email}
        </div>
      )}
    </div>
  );
}
