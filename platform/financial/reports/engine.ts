import type {
  FinancialAnalysisResult,
} from "../analysis";

import type {
  FinancialRiskResult,
} from "../risk";

import type {
  FinancialExecutiveReportRequest,
  FinancialExecutiveReportFinding,
  FinancialExecutiveReportMetric,
  FinancialExecutiveReportResult,
} from "./types";

export class FinancialExecutiveReportsEngine {
  generate(
    request: FinancialExecutiveReportRequest,
    analysis: FinancialAnalysisResult,
    risk?: FinancialRiskResult,
  ): FinancialExecutiveReportResult {
    return {
      context: request.context,
      periodId: request.periodId,
      type: request.type,
      title: this.getTitle(request.type),
      summary: this.buildSummary(
        request.type,
        analysis,
        risk,
      ),
      metrics: this.buildMetrics(
        analysis,
      ),
      findings: this.buildFindings(
        analysis,
      ),
      ...(risk ? { risk } : {}),
    };
  }

  private getTitle(
    type: FinancialExecutiveReportRequest["type"],
  ): string {
    switch (type) {
      case "financial_summary":
        return "Resumen Financiero";
      case "performance":
        return "Desempeño Financiero";
      case "forecast":
        return "Pronóstico Financiero";
      case "risk":
        return "Reporte de Riesgo Financiero";
      case "investment":
        return "Reporte de Inversión";
    }
  }

  private buildMetrics(
    analysis: FinancialAnalysisResult,
  ): FinancialExecutiveReportMetric[] {
    const summary =
      analysis.summary;

    const currency =
      analysis.currency;

    const metrics: FinancialExecutiveReportMetric[] =
      [
        {
          name: "Ingresos",
          value: summary.revenue,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
        {
          name: "Costo de ventas",
          value: summary.costOfSales,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
        {
          name: "Utilidad bruta",
          value: summary.grossProfit,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
        {
          name: "Gastos operativos",
          value: summary.operatingExpenses,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
        {
          name: "Utilidad operativa",
          value: summary.operatingProfit,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
        {
          name: "Utilidad neta",
          value: summary.netProfit,
          unit: "currency",
          ...(currency ? { currency } : {}),
        },
      ];

    if (
      summary.grossMargin !== null
    ) {
      metrics.push({
        name: "Margen bruto",
        value: summary.grossMargin,
        unit: "percentage",
      });
    }

    if (
      summary.operatingMargin !== null
    ) {
      metrics.push({
        name: "Margen operativo",
        value: summary.operatingMargin,
        unit: "percentage",
      });
    }

    if (
      summary.netMargin !== null
    ) {
      metrics.push({
        name: "Margen neto",
        value: summary.netMargin,
        unit: "percentage",
      });
    }

    if (summary.assets !== 0) {
      metrics.push({
        name: "Activos",
        value: summary.assets,
        unit: "currency",
        ...(currency ? { currency } : {}),
      });
    }

    if (summary.liabilities !== 0) {
      metrics.push({
        name: "Pasivos",
        value: summary.liabilities,
        unit: "currency",
        ...(currency ? { currency } : {}),
      });
    }

    if (summary.equity !== 0) {
      metrics.push({
        name: "Patrimonio",
        value: summary.equity,
        unit: "currency",
        ...(currency ? { currency } : {}),
      });
    }

    return metrics;
  }

  private buildFindings(
    analysis: FinancialAnalysisResult,
  ): FinancialExecutiveReportFinding[] {
    const findings: FinancialExecutiveReportFinding[] =
      [];

    for (const finding of analysis.findings) {
      findings.push({
        type: finding.type,
        title: this.getFindingTitle(
          finding.type,
          finding.metric,
        ),
        message: finding.message,
        ...(finding.evidence
          ? {
              evidence:
                finding.evidence,
            }
          : {}),
        ...(finding.severity
          ? {
              severity: finding.severity,
            }
          : {}),
      });
    }

    if (
      analysis.dataQuality?.warnings
        .length
    ) {
      for (
        const warning of
          analysis.dataQuality.warnings
      ) {
        findings.push({
          type: "warning",
          title: "Calidad de datos",
          message: warning,
          severity: "medium",
        });
      }
    }

    return findings;
  }

  private getFindingTitle(
    type:
      | "positive"
      | "negative"
      | "warning"
      | "neutral",
    metric: string,
  ): string {
    switch (type) {
      case "positive":
        return `Fortaleza: ${metric}`;

      case "negative":
        return `Problema: ${metric}`;

      case "warning":
        return `Alerta: ${metric}`;

      case "neutral":
        return `Observación: ${metric}`;
    }
  }

  private buildSummary(
    type: FinancialExecutiveReportRequest["type"],
    analysis: FinancialAnalysisResult,
    risk?: FinancialRiskResult,
  ): string {
    const {
      revenue,
      grossProfit,
      operatingProfit,
      netProfit,
      grossMargin,
      operatingMargin,
      netMargin,
    } = analysis.summary;

    const parts: string[] = [];

    if (type === "financial_summary") {
      parts.push(
        `Ingresos de ${this.formatNumber(revenue)}.`,
      );

      parts.push(
        `Utilidad bruta de ${this.formatNumber(grossProfit)}.`,
      );

      parts.push(
        `Utilidad operativa de ${this.formatNumber(operatingProfit)}.`,
      );

      parts.push(
        `Utilidad neta de ${this.formatNumber(netProfit)}.`,
      );
    }

    if (type === "performance") {
      if (grossMargin !== null) {
        parts.push(
          `Margen bruto: ${this.formatPercentage(grossMargin)}.`,
        );
      }

      if (operatingMargin !== null) {
        parts.push(
          `Margen operativo: ${this.formatPercentage(operatingMargin)}.`,
        );
      }

      if (netMargin !== null) {
        parts.push(
          `Margen neto: ${this.formatPercentage(netMargin)}.`,
        );
      }
    }

    if (type === "forecast") {
      parts.push(
        "Este reporte requiere resultados del Forecast Engine para emitir una proyección.",
      );
    }

    if (type === "risk") {
      if (risk) {
        parts.push(
          `Nivel de riesgo: ${risk.riskLevel}.`,
        );

        parts.push(
          `Puntuación de riesgo: ${risk.riskScore}.`,
        );

        parts.push(
          `Factores de riesgo: ${risk.factors.length}.`,
        );

        parts.push(
          `Alertas: ${risk.alerts.length}.`,
        );
      } else {
        parts.push(
          "No se recibió el resultado del Risk Engine.",
        );
      }
    }

    if (type === "investment") {
      parts.push(
        "El reporte presenta la información financiera disponible para apoyar una evaluación de inversión.",
      );
    }

    if (
      analysis.dataQuality &&
      analysis.dataQuality.completeness < 100
    ) {
      parts.push(
        `Completitud de datos: ${analysis.dataQuality.completeness}%.`,
      );
    }

    return parts.join(" ");
  }

  private formatNumber(
    value: number,
  ): string {
    return Number.isFinite(value)
      ? value.toLocaleString("es-MX", {
          maximumFractionDigits: 2,
        })
      : "0";
  }

  private formatPercentage(
    value: number,
  ): string {
    return Number.isFinite(value)
      ? `${value.toFixed(2)}%`
      : "0.00%";
  }
}

export const financialExecutiveReportsEngine =
  new FinancialExecutiveReportsEngine();








