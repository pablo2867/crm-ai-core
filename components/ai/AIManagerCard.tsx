"use client";

import { useState } from "react";

export default function AIManagerCard() {

  const [analysis, setAnalysis] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function generateAnalysis() {

    try {

      setLoading(true);

      const response =
        await fetch(
          "/api/ai-sales-manager"
        );

      const data =
        await response.json();

      if (data.success) {

        setAnalysis(
          data.analysis || ""
        );

      }

    } catch (error) {

      console.error(
        "AI MANAGER ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      className="
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
        shadow-2xl
      "
    >

      <div className="mb-5">

        <p className="text-zinc-500 text-sm">
          CRM AI
        </p>

        <h2
          className="
            text-2xl
            font-black
            text-white
            mt-2
          "
        >
          🤖 AI Sales Manager
        </h2>

      </div>

      <button
        onClick={generateAnalysis}
        disabled={loading}
        className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-blue-900
          disabled:cursor-not-allowed
          text-white
          rounded-xl
          p-3
          font-semibold
          transition
        "
      >
        {loading
          ? "Analizando..."
          : "Generar análisis IA"}
      </button>

      <div className="mt-4">

        {!analysis &&
          !loading && (

            <p className="text-zinc-400">
              Presiona el botón para generar recomendaciones.
            </p>

          )}

        {analysis && (

          <div
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-xl
              p-4
              text-sm
              text-zinc-200
              whitespace-pre-wrap
            "
          >
            {analysis}
          </div>

        )}

      </div>

    </div>

  );

}
