import {
  aiGateway,
} from "@/platform/ai/gateway";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "./types";

export const chatResponseSkillDefinition:
  SkillDefinition = {

  id:
    "chat-response",

  name:
    "Chat Response",

  description:
    "Genera una respuesta conversacional usando el contexto CRM disponible.",

  async execute(
    request: SkillRequest
  ): Promise<SkillResult> {

    const input =
      request.input ?? {};

    const message =
      typeof input.message === "string"
        ? input.message.trim()
        : "";

    if (!message) {

      return {

        success:
          false,

        message:
          "No existe un mensaje para generar la respuesta.",

        error:
          "CHAT_MESSAGE_REQUIRED",

      };

    }

    const context =
      input.context ?? {};

    const prompt = `
Eres CRM AI Copilot.

Responde la pregunta del usuario usando
ÚNICAMENTE el contexto CRM proporcionado.

PREGUNTA:
${message}

CONTEXTO CRM:
${JSON.stringify(
  context,
  null,
  2
)}

REGLAS:
- Responde en español.
- Sé directo.
- No inventes datos.
- Usa los valores reales del contexto.
- Si la información no existe, dilo claramente.
- No describas el workflow.
- No describas el Runtime.
- Devuelve únicamente la respuesta al usuario.
`;

    const response =
      await aiGateway.generate({

        prompt,

        temperature:
          0.1,

        numPredict:
          120,

      });

    if (!response.success) {

      return {

        success:
          false,

        message:
          "No fue posible generar la respuesta del Copilot.",

        error:
          "CHAT_AI_GENERATION_FAILED",

      };

    }

    const answer =
      response.text
        .trim();

    return {

      success:
        true,

      message:
        "Respuesta generada correctamente.",

      data: {

        answer,

        provider:
          response.provider,

        model:
          response.model,

      },

    };

  },

};
