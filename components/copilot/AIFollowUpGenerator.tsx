"use client";

import { useState } from "react";

export default function AIFollowUpGenerator() {
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState("");

  async function generateFollowUp() {
    try {
      setLoading(true);

      const dashboardResponse = await fetch(
        "/api/copilot-dashboard",
        { cache: "no-store" }
      );

      const dashboard = await dashboardResponse.json();

      if (!dashboard.success) {
        setFollowUp("No fue posible obtener el lead.");
        return;
      }

      const response = await fetch(
        "/api/followup-generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id:
              dashboard.bestLeadId,
            name:
              dashboard.bestLead,
            score: dashboard.score,
            probability: dashboard.probability,
            revenue: dashboard.revenue,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setFollowUp(data.followUp);
      } else {
        setFollowUp("No fue posible generar seguimiento.");
      }
    } catch (err) {
      console.error(err);
      setFollowUp("Error generando seguimiento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="
      bg-gradient-to-br
      from-cyan-500/10
      to-blue-500/10
      border
      border-cyan-500/20
      rounded-3xl
      p-6
      mb-8
    ">
      <p className="text-cyan-400 text-sm">
        AI Follow-Up Generator
      </p>

      <h2 className="text-2xl font-black mt-3">
        Generador de Seguimientos
      </h2>

      <button
        onClick={generateFollowUp}
        disabled={loading}
        className="
          mt-5
          px-5
          py-3
          rounded-xl
          bg-cyan-500
          text-black
          font-bold
        "
      >
        {loading
          ? "Generando..."
          : "Generar seguimiento IA"}
      </button>

      {followUp && (
        <div className="
          mt-6
          p-4
          rounded-2xl
          bg-black/30
          whitespace-pre-wrap
          text-zinc-300
        ">
          {followUp}
        </div>
      )}
    </div>
  );
}

