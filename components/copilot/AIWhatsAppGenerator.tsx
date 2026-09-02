"use client";

import { useState } from "react";

export default function AIWhatsAppGenerator() {
  const [loading, setLoading] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");

  async function generateWhatsApp(
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
        setWhatsapp("No fue posible obtener el lead.");
        return;
      }

      const response = await fetch(
        "/api/whatsapp-generator",
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
        setWhatsapp(data.whatsapp);
      } else {
        setWhatsapp("No fue posible generar WhatsApp.");
      }
    } catch (err) {
      console.error(err);
      setWhatsapp("Error generando WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      bg-gradient-to-br
      from-green-500/10
      to-emerald-500/10
      border
      border-green-500/20
      rounded-3xl
      p-6
      mb-8
    ">
      <p className="text-green-400 text-sm">
        AI WhatsApp Generator
      </p>

      <h2 className="text-2xl font-black mt-3">
        Generador de WhatsApp
      </h2>

      <div className="
        flex
        flex-wrap
        gap-3
        mt-5
      ">
        <button
          onClick={() => generateWhatsApp("followup")}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-green-500
            text-white
            font-semibold
          "
        >
          Seguimiento
        </button>

        <button
          onClick={() => generateWhatsApp("reactivation")}
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
          Reactivación
        </button>

        <button
          onClick={() => generateWhatsApp("closing")}
          disabled={loading}
          className="
            px-4
            py-2
            rounded-xl
            bg-lime-500
            text-black
            font-semibold
          "
        >
          Cierre
        </button>
      </div>

      {loading && (
        <p className="mt-5 text-zinc-400">
          Generando WhatsApp...
        </p>
      )}

      {whatsapp && (
        <div className="
          mt-6
          p-4
          rounded-2xl
          bg-black/30
          whitespace-pre-wrap
          text-zinc-300
        ">
          {whatsapp}
        </div>
      )}
    </div>
  );
}
