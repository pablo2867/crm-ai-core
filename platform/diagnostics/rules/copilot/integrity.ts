import {
  workflowRegistry,
} from "@/platform/workflows/registry";

import {
  skillRegistry,
} from "@/platform/skills/registry";

import type {
  DiagnosticRule,
  DiagnosticIssue,
} from "../../types";

export const copilotIntegrityRule:
  DiagnosticRule = {

  id:
    "copilot.integrity",

  block:
    "copilot",

  category:
    "copilot",

  description:
    "Verifica la infraestructura necesaria para que Copilot pueda resolver y ejecutar consultas conversacionales.",

  check() {

    const issues:
      string[] = [];

    const generalChat =
      workflowRegistry.get(
        "general-chat"
      );

    if (!generalChat) {

      issues.push(
        "El workflow 'general-chat' no está registrado."
      );

    } else {

      if (
        generalChat.metadata?.enabled !==
        true
      ) {

        issues.push(
          "El workflow 'general-chat' no está habilitado."
        );

      }

      const supportsCopilot =
        generalChat.metadata
          ?.supportedIntents
          ?.includes(
            "copilot"
          ) === true;

      if (
        !supportsCopilot
      ) {

        issues.push(
          "El workflow 'general-chat' no declara soporte para el intent 'copilot'."
        );

      }

      const chatStep =
        generalChat.steps.find(
          step =>
            step.skill ===
            "chat-response"
        );

      if (!chatStep) {

        issues.push(
          "El workflow 'general-chat' no contiene la Skill 'chat-response'."
        );

      }

    }

    if (
      !skillRegistry.has(
        "chat-response"
      )
    ) {

      issues.push(
        "La Skill 'chat-response' no está registrada."
      );

    }

    if (
      issues.length === 0
    ) {

      return null;

    }

    const issue:
      DiagnosticIssue = {

      id:
        "copilot.integrity.failed",

      block:
        "copilot",

      category:
        "copilot",

      severity:
        "high",

      title:
        "Integridad de Copilot comprometida",

      description:
        issues.join(" "),

      rootCause:
        "La infraestructura requerida por el flujo conversacional de Copilot está incompleta o desconectada.",

      evidence: [

        {

          type:
            "code",

          source:
            "platform/copilot/types.ts",

          description:
            "Copilot utiliza Runtime, Decision, Workflow, Planner y Validation como parte de su contrato de respuesta.",

          value:
            {

              generalChatRegistered:
                Boolean(
                  generalChat
                ),

              generalChatEnabled:
                generalChat?.metadata
                  ?.enabled ?? false,

              supportsCopilot:
                generalChat?.metadata
                  ?.supportedIntents
                  ?.includes(
                    "copilot"
                  ) ?? false,

              chatResponseRegistered:
                skillRegistry.has(
                  "chat-response"
                ),

            },

        },

      ],

      affectedComponents: [

        "copilot",

        "copilot-controller",

        "copilot-router",

        "general-chat",

        "chat-response",

      ],

      repairable:
        false,

      risk:
        "high",

    };

    return issue;

  },

};
