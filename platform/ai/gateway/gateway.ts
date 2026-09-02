import OpenAI from "openai";

import {
  generateOllamaResponse,
} from "@/lib/ollama";

import type {
  AIGatewayRequest,
  AIGatewayResponse,
  AIGatewayErrorCode,
} from "./types";

type AIProvider =
  | "ollama"
  | "openrouter";

const DEFAULT_OLLAMA_MODEL =
  "qwen2.5:3b";

const DEFAULT_OPENROUTER_MODEL =
  "~openai/gpt-latest";

const OPENROUTER_BASE_URL =
  "https://openrouter.ai/api/v1";

export class AIGateway {

  private readonly defaultProvider: AIProvider;

  constructor() {

    const configuredProvider =
      process.env.AI_PROVIDER?.toLowerCase();

    this.defaultProvider =
      configuredProvider === "openrouter"
        ? "openrouter"
        : "ollama";

  }

  async generate(
    request: AIGatewayRequest
  ): Promise<AIGatewayResponse> {

    switch (this.defaultProvider) {

      case "openrouter":
        return this.generateWithOpenRouter(
          request
        );

      case "ollama":
      default:
        return this.generateWithOllama(
          request
        );

    }

  }

  private async generateWithOllama(
    request: AIGatewayRequest
  ): Promise<AIGatewayResponse> {

    const model =
      request.model ??
      process.env.AI_MODEL ??
      DEFAULT_OLLAMA_MODEL;

    const temperature =
      request.temperature ??
      0.1;

    const numPredict =
      request.numPredict ??
      40;

    const response =
      await generateOllamaResponse({

        prompt:
          request.prompt,

        model,

        temperature,

        numPredict,

      });

    return {

      success:
        response.success,

      text:
        response.text,

      provider:
        "ollama",

      model:
        response.model,

      duration:
        response.duration,

      ...(response.error
        ? {
            error:
              response.error,
          }
        : {}),

      ...(response.errorCode
        ? {
            errorCode:
              response.errorCode,
          }
        : {}),

    };

  }

  private async generateWithOpenRouter(
    request: AIGatewayRequest
  ): Promise<AIGatewayResponse> {

    const startedAt =
      performance.now();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return {

        success:
          false,

        text:
          "",

        provider:
          "openrouter",

        model:
          request.model ??
          process.env.AI_MODEL ??
          DEFAULT_OPENROUTER_MODEL,

        duration:
          performance.now() -
          startedAt,

        error:
          "OPENROUTER_API_KEY no est� configurada.",

        errorCode:
          "CONNECTION_ERROR",

      };

    }

    const model =
      request.model ??
      process.env.AI_MODEL ??
      DEFAULT_OPENROUTER_MODEL;

    const temperature =
      request.temperature ??
      0.1;

    try {

      const client =
        new OpenAI({

          baseURL:
            OPENROUTER_BASE_URL,

          apiKey,

          defaultHeaders: {

            ...(process.env.NEXT_PUBLIC_APP_URL
              ? {
                  "HTTP-Referer":
                    process.env.NEXT_PUBLIC_APP_URL,
                }
              : {}),

            ...(process.env.NEXT_PUBLIC_APP_NAME
              ? {
                  "X-Title":
                    process.env.NEXT_PUBLIC_APP_NAME,
                }
              : {}),

          },

        });

      const response =
        await client.chat.completions.create({

          model,

          temperature,

          messages: [

            {
              role:
                "user",

              content:
                request.prompt,

            },

          ],

        });

      const text =
        response.choices[0]?.message?.content
          ?.trim() ?? "";

      const duration =
        performance.now() -
        startedAt;

      if (!text) {

        return {

          success:
            false,

          text:
            "",

          provider:
            "openrouter",

          model,

          duration,

          error:
            "OpenRouter devolvi� una respuesta vac�a.",

          errorCode:
            "EMPTY_RESPONSE",

        };

      }

      return {

        success:
          true,

        text,

        provider:
          "openrouter",

        model,

        duration,

      };

    }
    catch (error) {

      const duration =
        performance.now() -
        startedAt;

      let errorCode:
        AIGatewayErrorCode =
        "UNKNOWN_ERROR";

      let errorMessage =
        "Error desconocido en OpenRouter.";

      if (
        error instanceof OpenAI.APIError
      ) {

        errorMessage =
          error.message ||
          "Error de OpenRouter.";

        if (
          error.status === 408 ||
          error.status === 504
        ) {

          errorCode =
            "TIMEOUT";

        }
        else if (
          error.status &&
          error.status >= 400
        ) {

          errorCode =
            "HTTP_ERROR";

        }

      }
      else if (
        error instanceof Error
      ) {

        errorMessage =
          error.message;

        errorCode =
          "CONNECTION_ERROR";

      }

      return {

        success:
          false,

        text:
          "",

        provider:
          "openrouter",

        model,

        duration,

        error:
          errorMessage,

        errorCode,

      };

    }

  }

}

export const aiGateway =
  new AIGateway();
