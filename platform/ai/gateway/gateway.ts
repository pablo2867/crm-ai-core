import {
  generateOllamaResponse,
} from "@/lib/ollama";

import type {
  AIGatewayRequest,
  AIGatewayResponse,
} from "./types";

export class AIGateway {

  private readonly defaultProvider =
    "ollama";

  private readonly defaultModel =
    "qwen2.5:3b";

  async generate(
    request: AIGatewayRequest
  ): Promise<AIGatewayResponse> {

    switch (
      this.defaultProvider
    ) {

      case "ollama":

        return this.generateWithOllama(
          request
        );

      default:

        throw new Error(
          `Proveedor AI no soportado: ${this.defaultProvider}`
        );

    }

  }

  private async generateWithOllama(
    request: AIGatewayRequest
  ): Promise<AIGatewayResponse> {

    const model =
      request.model ??
      this.defaultModel;

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
        this.defaultProvider,

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

}

export const aiGateway =
  new AIGateway();
