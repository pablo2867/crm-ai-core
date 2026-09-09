"use client";

import { useEffect, useState } from "react";

export default function AISalesManager() {

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {

    async function loadData() {

      try {

        const response =
          await fetch(
            "/api/ai-sales-manager"
          );

        const result =
          await response.json();

        if (!result.success) {

          setError(
            result.error ||
            "No fue posible generar el análisis."
          );

          return;

        }

        setData(result);

      } catch (error) {

        console.error(
          "AI SALES MANAGER ERROR:",
          error
        );

        setError(
          "Error conectando con AI Sales Manager."
        );

      } finally {

        setLoading(false);

      }

    }

    loadData();

  }, []);

  return (

    <div
      className="
        mb-8
        bg-[#111113]
        border
        border-zinc-800
        rounded-3xl
        p-6
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          text-white
          mb-4
        "
      >
        🤖 Director Comercial IA
      </h2>

      {loading && (

        <div
          className="
            text-zinc-400
          "
        >
          Analizando oportunidades...
        </div>

      )}

      {!loading && error && (

        <div
          className="
            bg-red-950
            border
            border-red-800
            rounded-xl
            p-4
            text-red-300
          "
        >
          {error}
        </div>

      )}

      {!loading && !error && data && (

        <>

          <div
            className="
              flex
              gap-6
              mb-4
              text-sm
            "
          >

            <div className="text-zinc-300">
              Leads: {data.totalLeads || 0}
            </div>

            <div className="text-red-400">
              HOT: {data.hotLeads || 0}
            </div>

          </div>

          <div
            className="
              bg-zinc-900
              border
              border-zinc-700
              rounded-2xl
              p-4
              text-zinc-300
              whitespace-pre-wrap
              leading-relaxed
            "
          >
            {data.analysis ||
              "Sin análisis disponible."}
          </div>

        </>

      )}

    </div>

  );

}
