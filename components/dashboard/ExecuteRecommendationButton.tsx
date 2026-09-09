"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface ExecuteRecommendationButtonProps {

  action: string;

  userId: string;

  leadId?: number;

  payload?: Record<string, unknown>;

}

export default function ExecuteRecommendationButton({

  action,

  userId,

  leadId,

  payload,

}: ExecuteRecommendationButtonProps) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [, startTransition] =
    useTransition();

  async function execute() {

    try {

      setLoading(true);

      setMessage(null);

      const response =
        await fetch("/api/actions", {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            action,

            userId,

            leadId,

            payload,

          }),

        });

      const result =
        await response.json();

      if (!response.ok || !result.success) {

        throw new Error(

          result.error ??

          "No fue posible ejecutar la acción."

        );

      }

      const workflow =
        result.result?.workflow;

      if (workflow) {

        const executedSkills =
          workflow.execution?.length ?? 0;

        const successfulSkills =
          workflow.execution?.filter(
            (step: { success: boolean }) => step.success
          ).length ?? 0;

        const totalTime =
          workflow.execution?.reduce(
            (
              total: number,
              step: { durationMs: number }
            ) => total + step.durationMs,
            0
          ) ?? 0;

        setMessage(

          `✅ Workflow ejecutado correctamente.\n` +

          `Skills ejecutadas: ${executedSkills}\n` +

          `Skills exitosas: ${successfulSkills}\n` +

          `Tiempo total: ${totalTime} ms`

        );

      } else {

        setMessage(

          result.result?.message ??

          "Acción ejecutada correctamente."

        );

      }

      startTransition(() => {

        router.refresh();

      });

    } catch (error) {

      setMessage(

        error instanceof Error

          ? error.message

          : "Error ejecutando la acción."

      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="mt-4">

      <button

        onClick={execute}

        disabled={loading}

        className="
          w-full
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          disabled:bg-zinc-700
          disabled:cursor-not-allowed
          px-4
          py-3
          font-semibold
          transition
        "

      >

        {loading

          ? "Ejecutando..."

          : "Ejecutar"}

      </button>

      {message && (

        <div
          className="
            mt-4
            rounded-xl
            border
            border-zinc-700
            bg-zinc-900
            p-4
          "
        >

          <pre
            className="
              whitespace-pre-wrap
              text-sm
              text-zinc-300
              font-sans
            "
          >

            {message}

          </pre>

        </div>

      )}

    </div>

  );

}
