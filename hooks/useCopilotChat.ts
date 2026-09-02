"use client";

import { useState } from "react";

import type {
  CopilotMessage,
} from "@/types/copilot";

export function useCopilotChat() {

  const [question, setQuestion] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<CopilotMessage[]>([]);

  async function askCopilot(
    customQuestion?: string
  ) {

    const finalQuestion =
      customQuestion?.trim() ||
      question.trim();

    if (!finalQuestion) {
      return;
    }

    setLoading(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: finalQuestion,
      },
    ]);

    try {

      const response =
        await fetch(
          "/api/ai-copilot",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              question:
                finalQuestion,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "AI COPILOT RESPONSE:",
        data
      );

      /*
      ---------------------------------------
      ERROR HTTP
      ---------------------------------------
      */

      if (!response.ok) {

        throw new Error(
          data?.answer ??
          data?.error ??
          `HTTP ${response.status}`
        );

      }

      /*
      ---------------------------------------
      RESOLVER RESPUESTA
      ---------------------------------------
      */

      let assistantMessage =
        "Sin respuesta del Copilot.";

      if (
        typeof data.answer ===
        "string" &&
        data.answer.trim()
      ) {

        assistantMessage =
          data.answer;

      }

      else if (
        typeof data.result?.answer ===
        "string" &&
        data.result.answer.trim()
      ) {

        assistantMessage =
          data.result.answer;

      }

      else if (
        typeof data.result?.summary ===
        "string" &&
        data.result.summary.trim()
      ) {

        assistantMessage =
          data.result.summary;

      }

      else if (
        typeof data.runtime?.summary ===
        "string" &&
        data.runtime.summary.trim()
      ) {

        assistantMessage =
          data.runtime.summary;

      }

      else if (
        typeof data.result?.result?.answer ===
        "string" &&
        data.result.result.answer.trim()
      ) {

        assistantMessage =
          data.result.result.answer;

      }

      /*
      ---------------------------------------
      SKILL
      ---------------------------------------
      */

      if (
        data.source === "skill" &&
        data.skill
      ) {

        assistantMessage =
          `Accion ejecutada mediante la Skill "${data.skill}".`;

      }

      /*
      ---------------------------------------
      MENSAJE
      ---------------------------------------
      */

      setMessages((prev) => [

        ...prev,

        {

          role:
            "assistant",

          content:
            assistantMessage,

          runtime:
            data.runtime ??
            data.result?.runtime,

          decision:
            data.decision ??
            data.result?.decision,

          workflow:
            data.workflow ??
            data.result?.workflow,

          plan:
            data.plan ??
            data.result?.plan,

          validation:
            data.validation ??
            data.result?.validation,

          explanation:
            data.explanation ??
            data.result?.explanation,

        },

      ]);

    }

    catch (error) {

      console.error(
        "AI COPILOT ERROR:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido ejecutando AI Copilot.";

      setMessages((prev) => [

        ...prev,

        {

          role:
            "assistant",

          content:
            `Error del AI Copilot: ${errorMessage}`,

        },

      ]);

    }

    finally {

      setQuestion("");

      setLoading(false);

    }

  }

  return {

    question,

    setQuestion,

    loading,

    messages,

    askCopilot,

  };

}
