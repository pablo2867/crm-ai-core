"use client";

import { useState } from "react";

type Lead = {
  id?: number;
  name?: string;
  company?: string;
  email?: string;
  phone?: string | null;
  status?: string;
  ai_score?: number;
  ai_temperature?: string;
  close_probability?: number;
  estimated_revenue?: number;
};

type WhatsAppType =
  | "followup"
  | "reactivation"
  | "closing";

export default function AIWhatsAppGenerator() {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [lead, setLead] = useState<Lead | null>(null);
  const [sendResult, setSendResult] = useState("");
  const [debug, setDebug] = useState("");

  async function getLeadWithPhone(): Promise<Lead | null> {
    try {
      setDebug("Buscando leads...");

      const response = await fetch("/api/leads", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        setDebug(
          `Error obteniendo leads: ${response.status}`
        );
        return null;
      }

      const data = await response.json();

      const leads: Lead[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.leads)
          ? data.leads
          : [];

      const leadWithPhone = leads.find(
        (item) =>
          typeof item?.phone === "string" &&
          item.phone.trim().length > 0
      );

      if (leadWithPhone) {
        setDebug(
          `Lead encontrado: ${
            leadWithPhone.name || "Sin nombre"
          }`
        );

        return leadWithPhone;
      }

      setDebug(
        "No se encontró ningún lead con teléfono."
      );

      return null;
    } catch (error) {
      console.error(
        "GET_LEAD_WITH_PHONE_ERROR",
        error
      );

      setDebug(
        "Error consultando los leads."
      );

      return null;
    }
  }

  async function generateWhatsApp(
    type: WhatsAppType
  ) {
    if (loading) {
      return;
    }

    setLoading(true);
    setWhatsapp("");
    setSendResult("");
    setLead(null);
    setDebug(
      `Botón ${type} ejecutado correctamente.`
    );

    try {
      const selectedLead =
        await getLeadWithPhone();

      if (!selectedLead) {
        setWhatsapp(
          "No hay ningún lead con teléfono registrado para WhatsApp."
        );
        return;
      }

      setLead(selectedLead);

      setDebug(
        `Generando WhatsApp para ${
          selectedLead.name || "lead"
        }...`
      );

      const response = await fetch(
        "/api/whatsapp-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lead: selectedLead,
            type,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setWhatsapp(
          data?.error ||
            "No fue posible generar WhatsApp."
        );
        return;
      }

      setWhatsapp(data.whatsapp || "");

      setDebug(
        `WhatsApp generado para ${
          selectedLead.name || "lead"
        }.`
      );
    } catch (error) {
      console.error(
        "GENERATE_WHATSAPP_ERROR",
        error
      );

      setWhatsapp(
        "Error generando WhatsApp."
      );

      setDebug(
        "Error ejecutando el generador."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendWhatsApp() {
    if (sending) {
      return;
    }

    if (!lead?.phone) {
      setSendResult(
        "Este lead no tiene teléfono registrado."
      );
      return;
    }

    if (!whatsapp.trim()) {
      setSendResult(
        "Primero genera el mensaje de WhatsApp."
      );
      return;
    }

    try {
      setSending(true);
      setSendResult("");

      const response = await fetch(
        "/api/whatsapp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: lead.phone,
            message: whatsapp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSendResult(
          data?.error ||
            "No fue posible enviar el WhatsApp."
        );
        return;
      }

      setSendResult(
        `WhatsApp enviado correctamente a ${
          lead.name || lead.phone
        }.`
      );
    } catch (error) {
      console.error(
        "SEND_WHATSAPP_ERROR",
        error
      );

      setSendResult(
        "Error enviando WhatsApp."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-zinc-800 bg-[#111113] p-6 text-white">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">
          AI WhatsApp Generator
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Generador de WhatsApp
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void generateWhatsApp("followup")
          }
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Seguimiento
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void generateWhatsApp("reactivation")
          }
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reactivación
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            void generateWhatsApp("closing")
          }
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cierre
        </button>
      </div>

      {loading && (
        <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
          Generando mensaje...
        </div>
      )}

      {debug && (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
          {debug}
        </div>
      )}

      {lead && (
        <div className="mb-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="font-medium">
            Lead seleccionado:{" "}
            {lead.name || "Sin nombre"}
          </div>

          <div className="mt-1 text-sm text-zinc-400">
            Teléfono: {lead.phone}
          </div>
        </div>
      )}

      {whatsapp && (
        <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
          <div className="mb-2 text-xs font-medium uppercase text-zinc-500">
            Mensaje generado
          </div>

          <div className="whitespace-pre-wrap text-sm text-zinc-200">
            {whatsapp}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => void sendWhatsApp()}
        disabled={
          sending ||
          !lead?.phone ||
          !whatsapp
        }
        className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending
          ? "Enviando..."
          : "📲 Enviar por WhatsApp"}
      </button>

      {sendResult && (
        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm">
          {sendResult}
        </div>
      )}
    </section>
  );
}