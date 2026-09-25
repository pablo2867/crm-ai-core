"use client";

import { useState } from "react";

import FinancialDashboard from "@/components/financial/FinancialDashboard";

type FinancialIntakeMode = "owner" | "accountant";

interface FinancialIntakeResult {
  status?: string;
  informationStatus?: string;
  nextQuestion?: {
    id?: string;
    field?: string;
    question?: string;
  } | null;
  extractedData?: unknown[];
  missingFields?: string[];
  inconsistencies?: unknown[];
  requiresConfirmation?: boolean;
  canContinueToAnalysis?: boolean;
  completionPercentage?: number;
  state?: unknown;
  mapping?: unknown;
  interview?: unknown;
}

export default function FinancialPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [intakeMode, setIntakeMode] =
    useState<FinancialIntakeMode>("owner");

  const [intakeMessage, setIntakeMessage] =
    useState("");

  const [intakeLoading, setIntakeLoading] =
    useState(false);

  const [intakeError, setIntakeError] =
    useState<string | null>(null);

  const [intakeResult, setIntakeResult] =
    useState<FinancialIntakeResult | null>(null);

  const [intakeState, setIntakeState] =
    useState<any>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/financial/analysis",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            goal: "Realizar diagnóstico financiero completo",
            input: {
              financialIntent: "analysis",
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "No fue posible ejecutar el análisis financiero."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error ejecutando el análisis financiero."
      );
    } finally {
      setLoading(false);
    }
  }

  async function initializeIntake() {
    setIntakeLoading(true);
    setIntakeError(null);

    try {
      const response = await fetch(
        "/api/financial/intake",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: intakeMode,
          }),
        }
      );

      const data =
        (await response.json()) as FinancialIntakeResult;

      if (!response.ok) {
        throw new Error(
          (data as any)?.error ||
            "No fue posible iniciar la entrevista financiera."
        );
      }

      setIntakeResult(data);
      setIntakeState(data.state ?? null);
    } catch (err) {
      setIntakeError(
        err instanceof Error
          ? err.message
          : "Error iniciando la entrevista financiera."
      );
    } finally {
      setIntakeLoading(false);
    }
  }

  async function sendIntakeMessage() {
    const message = intakeMessage.trim();

    if (!message) {
      return;
    }

    setIntakeLoading(true);
    setIntakeError(null);

    try {
      const response = await fetch(
        "/api/financial/intake",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: intakeMode,
            message,
            state: intakeState,
          }),
        }
      );

      const data =
        (await response.json()) as FinancialIntakeResult;

      if (!response.ok) {
        throw new Error(
          (data as any)?.error ||
            "No fue posible procesar la respuesta."
        );
      }

      setIntakeResult(data);
      setIntakeState(data.state ?? null);
      setIntakeMessage("");
    } catch (err) {
      setIntakeError(
        err instanceof Error
          ? err.message
          : "Error procesando la respuesta financiera."
      );
    } finally {
      setIntakeLoading(false);
    }
  }

  async function handleConfirmation(
    action: "confirm" | "reject"
  ) {
    if (
      !intakeState ||
      !intakeResult?.nextQuestion?.field
    ) {
      return;
    }

    setIntakeLoading(true);
    setIntakeError(null);

    try {
      const response = await fetch(
        "/api/financial/intake",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: intakeMode,
            action,
            field:
              intakeResult.nextQuestion.field,
            use: "latest",
            state: intakeState,
          }),
        }
      );

      const data =
        (await response.json()) as FinancialIntakeResult;

      if (!response.ok) {
        throw new Error(
          (data as any)?.error ||
            "No fue posible procesar la confirmación."
        );
      }

      setIntakeResult(data);
      setIntakeState(data.state ?? null);
    } catch (err) {
      setIntakeError(
        err instanceof Error
          ? err.message
          : "Error procesando la confirmación."
      );
    } finally {
      setIntakeLoading(false);
    }
  }

  const financialData =
    result?.data?.data;

  const question =
    intakeResult?.nextQuestion;

  return (
    <main className="min-h-screen bg-[#09090B] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <p className="text-zinc-500 text-sm">
            FINANCIAL INTELLIGENCE
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-2">
            Diagnóstico Financiero
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl">
            Analiza ingresos, gastos, rentabilidad,
            tendencias y variaciones financieras de tu
            empresa.
          </p>
        </div>

        {/* ================================
            FINANCIAL INTAKE + AI
        ================================= */}

        <section className="mb-10 rounded-3xl border border-zinc-800 bg-[#111113] p-6 md:p-8">

          <div className="mb-6">
            <p className="text-zinc-500 text-xs tracking-widest">
              FINANCIAL INTAKE + AI
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              Captura de información financiera
            </h2>

            <p className="text-zinc-400 mt-2 max-w-2xl">
              Proporciona la información financiera de tu
              empresa. El sistema identificará datos
              faltantes e inconsistencias antes del análisis.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">

            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-2">
                Modo de entrevista
              </label>

              <select
                value={intakeMode}
                onChange={(event) =>
                  setIntakeMode(
                    event.target.value as FinancialIntakeMode
                  )
                }
                disabled={intakeLoading}
                className="
                  w-full
                  rounded-xl
                  border
                  border-zinc-700
                  bg-[#09090B]
                  px-4
                  py-3
                  text-white
                  outline-none
                "
              >
                <option value="owner">
                  Dueño de empresa
                </option>

                <option value="accountant">
                  Contador / financiero
                </option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={initializeIntake}
                disabled={intakeLoading}
                className="
                  w-full
                  md:w-auto
                  px-6
                  py-3
                  rounded-xl
                  bg-white
                  text-black
                  font-semibold
                  disabled:opacity-50
                "
              >
                {intakeLoading
                  ? "Iniciando..."
                  : "Iniciar entrevista"}
              </button>
            </div>

          </div>

          {intakeResult && (
            <div className="mb-6 rounded-2xl border border-zinc-800 bg-[#09090B] p-5">

              <div className="flex flex-wrap gap-3 mb-4">

                {intakeResult.status && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
                    Estado: {intakeResult.status}
                  </span>
                )}

                {typeof intakeResult.completionPercentage ===
                  "number" && (
                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs">
                    Completado:{" "}
                    {intakeResult.completionPercentage}%
                  </span>
                )}

                {intakeResult.requiresConfirmation && (
                  <span className="rounded-full bg-yellow-500/10 text-yellow-400 px-3 py-1 text-xs">
                    Requiere confirmación
                  </span>
                )}

              </div>

              {question?.question && (
                <div>
                  <p className="text-zinc-500 text-xs mb-2">
                    SIGUIENTE PREGUNTA
                  </p>

                  <p className="text-lg text-white">
                    {question.question}
                  </p>
                </div>
              )}

            </div>
          )}

          {intakeResult?.requiresConfirmation && (
            <div className="mb-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

              <p className="text-yellow-400 font-semibold mb-3">
                Confirmación humana requerida
              </p>

              <p className="text-zinc-400 text-sm mb-4">
                El sistema detectó información que requiere
                confirmación antes de continuar con el análisis.
              </p>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    handleConfirmation("confirm")
                  }
                  disabled={intakeLoading}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-white
                    text-black
                    font-semibold
                    disabled:opacity-50
                  "
                >
                  Confirmar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleConfirmation("reject")
                  }
                  disabled={intakeLoading}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    border
                    border-zinc-700
                    text-white
                    disabled:opacity-50
                  "
                >
                  Rechazar
                </button>

              </div>

            </div>
          )}

          {intakeResult && (
            <div className="flex flex-col md:flex-row gap-3">

              <input
                type="text"
                value={intakeMessage}
                onChange={(event) =>
                  setIntakeMessage(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    void sendIntakeMessage();
                  }
                }}
                placeholder="Escribe tu respuesta financiera..."
                disabled={intakeLoading}
                className="
                  flex-1
                  rounded-xl
                  border
                  border-zinc-700
                  bg-[#09090B]
                  px-4
                  py-3
                  text-white
                  placeholder:text-zinc-600
                  outline-none
                "
              />

              <button
                type="button"
                onClick={sendIntakeMessage}
                disabled={
                  intakeLoading ||
                  !intakeMessage.trim()
                }
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-white
                  text-black
                  font-semibold
                  disabled:opacity-50
                "
              >
                {intakeLoading
                  ? "Procesando..."
                  : "Enviar"}
              </button>

            </div>
          )}

          {intakeError && (
            <div
              className="
                mt-5
                rounded-2xl
                border
                border-red-500/30
                bg-red-500/10
                p-4
                text-red-400
              "
            >
              {intakeError}
            </div>
          )}

        </section>

        {/* ================================
            FINANCIAL ANALYSIS
        ================================= */}

        <div className="mb-8">
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-2xl
              bg-white
              text-black
              font-semibold
              disabled:opacity-50
              transition
            "
          >
            {loading
              ? "Analizando..."
              : "Ejecutar diagnóstico"}
          </button>
        </div>

        {error && (
          <div
            className="
              mb-8
              rounded-2xl
              border
              border-red-500/30
              bg-red-500/10
              p-4
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {!financialData &&
          !loading &&
          !error && (
            <div
              className="
                bg-[#111113]
                border
                border-zinc-800
                rounded-3xl
                p-8
                text-zinc-400
              "
            >
              Ejecuta el diagnóstico para cargar la
              información financiera.
            </div>
          )}

        {financialData && (
          <FinancialDashboard
            data={financialData}
          />
        )}

      </div>
    </main>
  );
}
