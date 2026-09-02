export type OllamaErrorCode =
  | "TIMEOUT"
  | "CONNECTION_ERROR"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE"
  | "EMPTY_RESPONSE"
  | "UNKNOWN_ERROR";

export interface OllamaRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  numPredict?: number;
}

export interface OllamaResponse {
  success: boolean;
  text: string;
  model: string;
  duration: number;
  error?: string;
  errorCode?: OllamaErrorCode;
}

const DEFAULT_MODEL = "qwen2.5:3b";

const OLLAMA_URL =
  "http://127.0.0.1:11434/api/generate";

const TIMEOUT_MS = 60000;

/*
---------------------------------------
OLLAMA MODEL KEEP ALIVE
---------------------------------------

Mantiene el modelo cargado en memoria
después de una petición.

Esto evita que Ollama descargue el modelo
por inactividad y tenga que volver a
cargarlo en la siguiente petición.
*/

const KEEP_ALIVE = "30m";

export async function generateOllamaResponse({
  prompt,
  model = DEFAULT_MODEL,
  temperature = 0.1,
  numPredict = 80,
}: OllamaRequest): Promise<OllamaResponse> {

  const startedAt =
    performance.now();

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, TIMEOUT_MS);

  try {

    const response =
      await fetch(
        OLLAMA_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          signal:
            controller.signal,

          body: JSON.stringify({

            model,

            prompt,

            stream:
              false,

            keep_alive:
              KEEP_ALIVE,

            options: {

              temperature,

              top_p:
                0.8,

              num_predict:
                numPredict,

            },

          }),

        }
      );

    const duration =
      performance.now() -
      startedAt;

    if (!response.ok) {

      return {

        success:
          false,

        text:
          "",

        model,

        duration,

        error:
          `Ollama HTTP error: ${response.status}`,

        errorCode:
          "HTTP_ERROR",

      };

    }

    const data =
      await response.json();

    if (
      !data ||
      typeof data.response !==
        "string"
    ) {

      return {

        success:
          false,

        text:
          "",

        model,

        duration,

        error:
          "Respuesta inválida de Ollama.",

        errorCode:
          "INVALID_RESPONSE",

      };

    }

    let text =
      data.response.trim();

    if (!text) {

      return {

        success:
          false,

        text:
          "",

        model,

        duration,

        error:
          "Ollama devolvió una respuesta vacía.",

        errorCode:
          "EMPTY_RESPONSE",

      };

    }

    text =
      text
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\*\*/g, "")
        .replace(/\[.*?\]/g, "")
        .trim();

    if (!text) {

      return {

        success:
          false,

        text:
          "",

        model,

        duration,

        error:
          "La respuesta procesada quedó vacía.",

        errorCode:
          "EMPTY_RESPONSE",

      };

    }

    if (text.length > 300) {

      text =
        text.substring(
          0,
          300
        );

    }

    return {

      success:
        true,

      text,

      model,

      duration,

    };

  } catch (error) {

    const duration =
      performance.now() -
      startedAt;

    if (
      error instanceof DOMException &&
      error.name === "AbortError"
    ) {

      return {

        success:
          false,

        text:
          "",

        model,

        duration,

        error:
          "Ollama excedió el tiempo máximo de espera.",

        errorCode:
          "TIMEOUT",

      };

    }

    return {

      success:
        false,

      text:
        "",

      model,

      duration,

      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al conectar con Ollama.",

      errorCode:
        "CONNECTION_ERROR",

    };

  } finally {

    clearTimeout(timeout);

  }

}
