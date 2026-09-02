"use client";

import { useState } from "react";

interface ExecutionStep {
  skill: string;
  success: boolean;
  message: string;
  durationMs: number;
}

const ACTIONS = [
  {
    label: "🎯 Buscar mejor oportunidad",
    prompt: "Encuentra el mejor lead para contactar.",
  },
  {
    label: "✉️ Generar follow-up",
    prompt: "Genera un follow-up para el mejor lead.",
  },
  {
    label: "📋 Crear tarea",
    prompt: "Crea una tarea para el mejor lead.",
  },
  {
    label: "📈 Analizar pipeline",
    prompt: "Analiza el pipeline completo.",
  },
  {
    label: "🧠 Resumen ejecutivo",
    prompt: "Genera un resumen ejecutivo del negocio.",
  },
];

export default function ExecuteWorkflowButton() {

  const [loading, setLoading] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [workflow, setWorkflow] =
    useState("");

  const [execution, setExecution] =
    useState<ExecutionStep[]>([]);

  async function execute(prompt: string) {

    try {

      setLoading(prompt);

      setMessage("");

      setWorkflow("");

      setExecution([]);

      const response =
        await fetch(
          "/api/ai-execution",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

            },

            body: JSON.stringify({

              message: prompt,

            }),

          }
        );

      const data =
        await response.json();

      if (data.success) {

        setMessage(
          "IA ejecutada correctamente."
        );

        setWorkflow(
          data.result?.workflow?.name ??
          "Workflow IA"
        );

        setExecution(
          data.result?.execution ??
          []
        );

      } else {

        setMessage(

          data.message ??

          "No fue posible ejecutar la IA."

        );

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "Error ejecutando la IA."
      );

    } finally {

      setLoading(null);

    }

  }

  return (

    <div className="space-y-4">

      <div className="grid gap-3">

        {ACTIONS.map((action) => (

          <button
            key={action.prompt}
            onClick={() =>
              execute(action.prompt)
            }
            disabled={loading !== null}
            className="
              w-full
              rounded-xl
              bg-blue-600
              hover:bg-blue-500
              disabled:bg-zinc-700
              transition
              py-3
              px-4
              text-left
              font-semibold
            "
          >

            {loading === action.prompt
              ? "Ejecutando..."
              : action.label}

          </button>

        ))}

      </div>

      {message && (

        <div
          className="
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            p-4
          "
        >

          <div className="font-semibold">

            {message}

          </div>

          {workflow && (

            <div className="mt-4">

              <div className="font-bold text-blue-400">

                {workflow}

              </div>

              <div className="mt-3 space-y-2">

                {execution.map((step) => (

                  <div
                    key={`${step.skill}-${step.durationMs}`}
                    className="
                      flex
                      justify-between
                      text-sm
                    "
                  >

                    <span>

                      {step.success
                        ? "✅"
                        : "❌"}{" "}

                      {step.skill}

                    </span>

                    <span className="text-zinc-400">

                      {step.durationMs} ms

                    </span>

                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

}