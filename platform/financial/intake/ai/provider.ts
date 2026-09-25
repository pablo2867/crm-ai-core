import {
  FinancialIntakeMode,
  FinancialIntakeQuestion,
} from "../types";

export interface FinancialAIProviderRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}

export interface FinancialAIProviderResponse {
  content: string;
  provider: "ollama" | "openrouter" | "fallback";
  model?: string;
}

export interface FinancialAIProvider {
  generate(
    request: FinancialAIProviderRequest
  ): Promise<FinancialAIProviderResponse>;
}

class FinancialAIProviderAdapter
  implements FinancialAIProvider
{
  async generate(
    request: FinancialAIProviderRequest
  ): Promise<FinancialAIProviderResponse> {
    const provider =
      process.env.FINANCIAL_AI_PROVIDER ??
      "ollama";

    if (provider === "openrouter") {
      return this.generateWithOpenRouter(
        request
      );
    }

    return this.generateWithOllama(request);
  }

  private async generateWithOllama(
    request: FinancialAIProviderRequest
  ): Promise<FinancialAIProviderResponse> {
    const baseUrl =
      process.env.OLLAMA_BASE_URL ??
      "http://127.0.0.1:11434";

    const model =
      process.env.FINANCIAL_OLLAMA_MODEL ??
      "qwen2.5:3b";

    try {
      const response = await fetch(
        `${baseUrl}/api/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            prompt: this.buildPrompt(request),
            stream: false,
            options: {
              temperature:
                request.temperature ?? 0.1,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Ollama respondió con HTTP ${response.status}.`
        );
      }

      const data = (await response.json()) as {
        response?: string;
      };

      if (!data.response?.trim()) {
        throw new Error(
          "Ollama no devolvió contenido."
        );
      }

      return {
        content: data.response.trim(),
        provider: "ollama",
        model,
      };
    } catch {
      return this.fallbackResponse();
    }
  }

  private async generateWithOpenRouter(
    request: FinancialAIProviderRequest
  ): Promise<FinancialAIProviderResponse> {
    const apiKey =
      process.env.OPENROUTER_API_KEY;

    const model =
      process.env.FINANCIAL_OPENROUTER_MODEL ??
      "qwen/qwen-2.5-3b-instruct";

    if (!apiKey) {
      return this.fallbackResponse();
    }

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            temperature:
              request.temperature ?? 0.1,
            messages: [
              {
                role: "system",
                content: request.systemPrompt,
              },
              {
                role: "user",
                content: request.userPrompt,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `OpenRouter respondió con HTTP ${response.status}.`
        );
      }

      const data = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      const content =
        data.choices?.[0]?.message?.content;

      if (!content?.trim()) {
        throw new Error(
          "OpenRouter no devolvió contenido."
        );
      }

      return {
        content: content.trim(),
        provider: "openrouter",
        model,
      };
    } catch {
      return this.fallbackResponse();
    }
  }

  private buildPrompt(
    request: FinancialAIProviderRequest
  ): string {
    return [
      request.systemPrompt,
      "",
      request.userPrompt,
    ].join("\n");
  }

  private fallbackResponse(): FinancialAIProviderResponse {
    return {
      content:
        "No fue posible consultar el proveedor de IA. Continúa utilizando la validación financiera estructurada.",
      provider: "fallback",
    };
  }
}

export const financialAIProvider =
  new FinancialAIProviderAdapter();

export function buildFinancialInterviewerSystemPrompt(
  mode: FinancialIntakeMode
): string {
  const modeInstruction =
    mode === "owner"
      ? "Utiliza lenguaje sencillo y evita terminología contable innecesaria."
      : "Utiliza terminología contable y financiera técnica.";

  return [
    "Eres un entrevistador financiero especializado.",
    "Trabajas exclusivamente con información proporcionada por el usuario.",
    "Nunca inventes valores financieros.",
    "No completes datos faltantes mediante suposiciones.",
    "Distingue entre información suficiente, insuficiente e inconsistente.",
    "Si existe una contradicción, solicita aclaración.",
    "Si un dato es materialmente diferente de uno anterior, solicita confirmación humana.",
    "Haz únicamente las preguntas necesarias para completar la información.",
    modeInstruction,
    "Responde de forma clara y estructurada.",
  ].join(" ");
}

export function buildFinancialInterviewerPrompt(
  question: FinancialIntakeQuestion,
  rawAnswer: string
): string {
  return [
    `Pregunta financiera: ${question.question}`,
    `Campo esperado: ${question.field}`,
    `Tipo esperado: ${question.type}`,
    `Respuesta del usuario: ${rawAnswer}`,
    "",
    "Interpreta exclusivamente la respuesta proporcionada.",
    "No agregues información que no esté presente.",
    "Devuelve únicamente información derivada de la respuesta.",
  ].join("\n");
}