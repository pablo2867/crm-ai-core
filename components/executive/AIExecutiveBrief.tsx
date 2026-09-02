"use client";

import { useEffect, useState } from "react";

export default function AIExecutiveBrief() {

  const [loading, setLoading] =
    useState(true);

  const [brief, setBrief] =
    useState("");

  useEffect(() => {

    async function loadBrief() {

      try {

        const response =
          await fetch(
            "/api/ai-executive-brief"
          );

        const data =
          await response.json();

        setBrief(
          data.brief ||
          "Sin resumen."
        );

      } catch (error) {

        console.error(
          "EXECUTIVE BRIEF ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    loadBrief();

  }, []);

  return (

    <div
      className="
        mb-8

        bg-gradient-to-r
        from-cyan-950
        to-blue-950

        border
        border-cyan-800

        rounded-3xl

        p-6
      "
    >

      <div className="mb-4">

        <p
          className="
            text-cyan-400
            text-sm
            font-semibold
          "
        >
          IA EJECUTIVA
        </p>

        <h2
          className="
            text-3xl
            font-black
            text-white
            mt-1
          "
        >
          Executive Brief
        </h2>

      </div>

      {loading ? (

        <div
          className="
            text-cyan-300
          "
        >
          Analizando pipeline...
        </div>

      ) : (

        <div
          className="
            text-zinc-200
            whitespace-pre-wrap
            leading-relaxed
          "
        >
          {brief}
        </div>

      )}

    </div>

  );

}