import type {
  FinancialCopilotIntent,
  FinancialCopilotRequest,
  FinancialCopilotResult,
} from "./types";

import {
  financialCopilotRouter,
} from "./router";

const INTENTS: FinancialCopilotIntent[] = [
  "analysis",
  "ratios",
  "forecast",
  "budget",
  "scenario",
  "sensitivity",
  "investment",
  "risk",
  "valuation",
  "report",
];

const INTENT_KEYWORDS: Record<
  FinancialCopilotIntent,
  string[]
> = {
  analysis: [
    "analiza",
    "analisis",
    "análisis",
    "ingresos",
    "gastos",
    "rentabilidad",
    "flujo",
  ],
  ratios: [
    "ratio",
    "ratios",
    "liquidez",
    "endeudamiento",
    "margen",
    "roa",
    "roe",
  ],
  forecast: [
    "pronostico",
    "pronóstico",
    "prevision",
    "previsión",
    "proyeccion",
    "proyección",
    "forecast",
  ],
  budget: [
    "presupuesto",
    "budget",
  ],
  scenario: [
    "escenario",
    "optimista",
    "pesimista",
  ],
  sensitivity: [
    "sensibilidad",
    "sensitivo",
    "sensibilidades",
  ],
  investment: [
    "inversion",
    "inversión",
    "roi",
    "npv",
    "vpn",
    "payback",
  ],
  risk: [
    "riesgo",
    "riesgos",
    "deuda",
    "liabilities",
  ],
  valuation: [
    "valuacion",
    "valuación",
    "valoracion",
    "valoración",
    "valor de empresa",
    "empresa vale",
    "dcf",
    "ebitda multiple",
  ],
  report: [
    "reporte",
    "informe",
    "resumen ejecutivo",
  ],
};

export class FinancialCopilotEngine {
  resolveIntent(
    message: string,
  ): {
    intent: FinancialCopilotIntent;
    confidence: number;
  } {
    const normalized =
      message.toLowerCase();

    let bestIntent: FinancialCopilotIntent =
      "analysis";

    let bestScore = 0;

    for (const intent of INTENTS) {
      const score =
        INTENT_KEYWORDS[intent].filter(
          (keyword) =>
            normalized.includes(keyword),
        ).length;

      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    return {
      intent: bestIntent,
      confidence:
        bestScore === 0
          ? 0.5
          : Math.min(
              1,
              0.6 + bestScore * 0.1,
            ),
    };
  }

  async execute(
    request: FinancialCopilotRequest,
  ): Promise<FinancialCopilotResult> {
    const resolved =
      request.intent ??
      this.resolveIntent(
        request.message,
      ).intent;

    const confidence =
      request.intent
        ? 1
        : this.resolveIntent(
            request.message,
          ).confidence;

    const data =
      await financialCopilotRouter.route(
        request,
        resolved,
      );

    return {
      context: request.context,
      message: request.message,
      intent: resolved,
      confidence,
      data:
        data as Record<string, unknown>,
      explanation:
        "Financial request processed successfully through the selected financial service and engine.",
      recommendations: [],
    };
  }
}

export const financialCopilotEngine =
  new FinancialCopilotEngine();