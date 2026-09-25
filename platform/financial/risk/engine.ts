import type {
  FinancialAnalysisResult,
} from "../analysis";

import type {
  FinancialRatiosResult,
} from "../ratios";

import type {
  FinancialRiskAlert,
  FinancialRiskFactor,
  FinancialRiskLevel,
  FinancialRiskRequest,
  FinancialRiskResult,
} from "./types";

export class FinancialRiskEngine {
  calculate(
    request: FinancialRiskRequest,
    analysis: FinancialAnalysisResult,
    ratios: FinancialRatiosResult,
  ): FinancialRiskResult {
    const debtRatio = this.getRatio(
      ratios,
      "debt_ratio",
    );

    const debtToEquity = this.getRatio(
      ratios,
      "debt_to_equity",
    );

    const currentRatio = this.getRatio(
      ratios,
      "current_ratio",
    );

    const quickRatio = this.getRatio(
      ratios,
      "quick_ratio",
    );

    const grossMargin =
      analysis.summary.grossMargin;

    const operatingMargin =
      analysis.summary.operatingMargin;

    const netMargin =
      analysis.summary.netMargin;

    const dataCompleteness =
      analysis.dataQuality?.completeness ?? null;

    const factors: FinancialRiskFactor[] = [];
    const alerts: FinancialRiskAlert[] = [];

    this.evaluateDebtRisk(
      debtRatio,
      debtToEquity,
      factors,
      alerts,
    );

    this.evaluateLiquidityRisk(
      currentRatio,
      quickRatio,
      factors,
      alerts,
    );

    this.evaluateProfitabilityRisk(
      grossMargin,
      operatingMargin,
      netMargin,
      factors,
      alerts,
    );

    this.evaluateDataQualityRisk(
      dataCompleteness,
      analysis.dataQuality?.warnings ?? [],
      factors,
      alerts,
    );

    const riskScore = Math.round(
      Math.min(
        100,
        factors.reduce(
          (total, factor) =>
            total + factor.contribution,
          0,
        ),
      ),
    );

    return {
      context: request.context,
      periodId: request.periodId,
      riskScore,
      riskLevel:
        this.getRiskLevel(riskScore),
      factors,
      alerts,
      debtRatio,
      debtToEquity,
      currentRatio,
      quickRatio,
      grossMargin,
      operatingMargin,
      netMargin,
      dataCompleteness,
      warnings:
        analysis.dataQuality?.warnings ?? [],
    };
  }

  private evaluateDebtRisk(
    debtRatio: number | null,
    debtToEquity: number | null,
    factors: FinancialRiskFactor[],
    alerts: FinancialRiskAlert[],
  ): void {
    if (debtRatio !== null) {
      const level =
        debtRatio >= 0.8
          ? "critical"
          : debtRatio >= 0.6
            ? "high"
            : debtRatio >= 0.4
              ? "medium"
              : "low";

      const contribution =
        debtRatio >= 0.8
          ? 30
          : debtRatio >= 0.6
            ? 22
            : debtRatio >= 0.4
              ? 12
              : 0;

      factors.push({
        category: "solvency",
        metric: "debt_ratio",
        value: debtRatio,
        contribution,
        level,
        message:
          "El nivel de endeudamiento representa un factor de riesgo de solvencia.",
        evidence: [
          `Debt ratio: ${this.formatRatio(debtRatio)}`,
        ],
      });

      if (level === "high" || level === "critical") {
        alerts.push({
          category: "solvency",
          severity: level,
          title: "Endeudamiento elevado",
          message:
            "El nivel de pasivos frente a activos requiere atención.",
          evidence: [
            `Debt ratio: ${this.formatRatio(debtRatio)}`,
          ],
        });
      }
    }

    if (debtToEquity !== null) {
      const level =
        debtToEquity >= 3
          ? "critical"
          : debtToEquity >= 2
            ? "high"
            : debtToEquity >= 1
              ? "medium"
              : "low";

      const contribution =
        debtToEquity >= 3
          ? 20
          : debtToEquity >= 2
            ? 12
            : debtToEquity >= 1
              ? 6
              : 0;

      factors.push({
        category: "solvency",
        metric: "debt_to_equity",
        value: debtToEquity,
        contribution,
        level,
        message:
          "La relación entre deuda y patrimonio aporta información sobre la presión financiera.",
        evidence: [
          `Debt to equity: ${this.formatRatio(debtToEquity)}`,
        ],
      });
    }
  }

  private evaluateLiquidityRisk(
    currentRatio: number | null,
    quickRatio: number | null,
    factors: FinancialRiskFactor[],
    alerts: FinancialRiskAlert[],
  ): void {
    if (currentRatio !== null) {
      const level =
        currentRatio < 0.75
          ? "critical"
          : currentRatio < 1
            ? "high"
            : currentRatio < 1.5
              ? "medium"
              : "low";

      const contribution =
        currentRatio < 0.75
          ? 25
          : currentRatio < 1
            ? 18
            : currentRatio < 1.5
              ? 8
              : 0;

      factors.push({
        category: "liquidity",
        metric: "current_ratio",
        value: currentRatio,
        contribution,
        level,
        message:
          "La razón circulante indica la capacidad disponible para cubrir obligaciones de corto plazo.",
        evidence: [
          `Current ratio: ${this.formatRatio(currentRatio)}`,
        ],
      });

      if (level === "high" || level === "critical") {
        alerts.push({
          category: "liquidity",
          severity: level,
          title: "Liquidez insuficiente",
          message:
            "La capacidad de cubrir obligaciones de corto plazo presenta un nivel de riesgo elevado.",
          evidence: [
            `Current ratio: ${this.formatRatio(currentRatio)}`,
          ],
        });
      }
    }

    if (quickRatio !== null) {
      const level =
        quickRatio < 0.5
          ? "critical"
          : quickRatio < 0.8
            ? "high"
            : quickRatio < 1
              ? "medium"
              : "low";

      const contribution =
        quickRatio < 0.5
          ? 20
          : quickRatio < 0.8
            ? 12
            : quickRatio < 1
              ? 5
              : 0;

      factors.push({
        category: "liquidity",
        metric: "quick_ratio",
        value: quickRatio,
        contribution,
        level,
        message:
          "La prueba ácida mide la liquidez disponible excluyendo inventarios.",
        evidence: [
          `Quick ratio: ${this.formatRatio(quickRatio)}`,
        ],
      });
    }
  }

  private evaluateProfitabilityRisk(
    grossMargin: number | null,
    operatingMargin: number | null,
    netMargin: number | null,
    factors: FinancialRiskFactor[],
    alerts: FinancialRiskAlert[],
  ): void {
    if (grossMargin !== null) {
      const level =
        grossMargin < 0
          ? "critical"
          : grossMargin < 10
            ? "high"
            : grossMargin < 20
              ? "medium"
              : "low";

      const contribution =
        grossMargin < 0
          ? 15
          : grossMargin < 10
            ? 10
            : grossMargin < 20
              ? 5
              : 0;

      factors.push({
        category: "profitability",
        metric: "gross_margin",
        value: grossMargin,
        contribution,
        level,
        message:
          "El margen bruto refleja la capacidad de generar utilidad después del costo de ventas.",
        evidence: [
          `Gross margin: ${this.formatPercentage(grossMargin)}`,
        ],
      });
    }

    if (operatingMargin !== null) {
      const level =
        operatingMargin < 0
          ? "critical"
          : operatingMargin < 5
            ? "high"
            : operatingMargin < 10
              ? "medium"
              : "low";

      const contribution =
        operatingMargin < 0
          ? 15
          : operatingMargin < 5
            ? 10
            : operatingMargin < 10
              ? 5
              : 0;

      factors.push({
        category: "operating",
        metric: "operating_margin",
        value: operatingMargin,
        contribution,
        level,
        message:
          "El margen operativo muestra la presión de los gastos sobre la operación.",
        evidence: [
          `Operating margin: ${this.formatPercentage(operatingMargin)}`,
        ],
      });

      if (level === "high" || level === "critical") {
        alerts.push({
          category: "operating",
          severity: level,
          title: "Presión operativa",
          message:
            "El margen operativo presenta un nivel que requiere atención.",
          evidence: [
            `Operating margin: ${this.formatPercentage(operatingMargin)}`,
          ],
        });
      }
    }

    if (netMargin !== null) {
      const level =
        netMargin < 0
          ? "critical"
          : netMargin < 5
            ? "high"
            : netMargin < 10
              ? "medium"
              : "low";

      const contribution =
        netMargin < 0
          ? 20
          : netMargin < 5
            ? 12
            : netMargin < 10
              ? 5
              : 0;

      factors.push({
        category: "profitability",
        metric: "net_margin",
        value: netMargin,
        contribution,
        level,
        message:
          "El margen neto refleja la rentabilidad final de la operación.",
        evidence: [
          `Net margin: ${this.formatPercentage(netMargin)}`,
        ],
      });

      if (level === "high" || level === "critical") {
        alerts.push({
          category: "profitability",
          severity: level,
          title: "Rentabilidad neta débil",
          message:
            "La rentabilidad final presenta un nivel de riesgo elevado.",
          evidence: [
            `Net margin: ${this.formatPercentage(netMargin)}`,
          ],
        });
      }
    }
  }

  private evaluateDataQualityRisk(
    completeness: number | null,
    warnings: string[],
    factors: FinancialRiskFactor[],
    alerts: FinancialRiskAlert[],
  ): void {
    if (completeness === null) {
      return;
    }

    const level =
      completeness < 50
        ? "critical"
        : completeness < 70
          ? "high"
          : completeness < 85
            ? "medium"
            : "low";

    const contribution =
      completeness < 50
        ? 20
        : completeness < 70
          ? 12
          : completeness < 85
            ? 5
            : 0;

    factors.push({
      category: "data_quality",
      metric: "data_completeness",
      value: completeness,
      contribution,
      level,
      message:
        "La completitud de los datos condiciona la confiabilidad de la evaluación de riesgo.",
      evidence: [
        `Data completeness: ${completeness}%`,
        ...warnings,
      ],
    });

    if (level === "high" || level === "critical") {
      alerts.push({
        category: "data_quality",
        severity: level,
        title: "Calidad de datos insuficiente",
        message:
          "La evaluación de riesgo debe interpretarse con cautela debido a la información disponible.",
        evidence: [
          `Data completeness: ${completeness}%`,
          ...warnings,
        ],
      });
    }
  }

  private getRatio(
    ratios: FinancialRatiosResult,
    type: FinancialRatiosResult["ratios"][number]["type"],
  ): number | null {
    return (
      ratios.ratios.find(
        (ratio) => ratio.type === type,
      )?.value ?? null
    );
  }

  private getRiskLevel(
    score: number,
  ): FinancialRiskLevel {
    if (score < 25) {
      return "low";
    }

    if (score < 50) {
      return "medium";
    }

    if (score < 75) {
      return "high";
    }

    return "critical";
  }

  private formatRatio(
    value: number,
  ): string {
    return Number.isFinite(value)
      ? value.toFixed(2)
      : "0.00";
  }

  private formatPercentage(
    value: number,
  ): string {
    return Number.isFinite(value)
      ? `${value.toFixed(2)}%`
      : "0.00%";
  }
}

export const financialRiskEngine =
  new FinancialRiskEngine();
