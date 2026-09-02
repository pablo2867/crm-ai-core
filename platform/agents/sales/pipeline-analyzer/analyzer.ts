import type {
  Lead,
} from "@/platform/services/lead-service";

import {
  leadAnalyzer,
} from "../lead-analyzer";

import type {
  PipelineAnalysis,
} from "./types";

export class PipelineAnalyzer {

  analyze(
    leads: Lead[]
  ): PipelineAnalysis {

    const analyses =
      leads.map(
        lead =>
          leadAnalyzer.analyze(
            lead
          )
      );

    const totalLeads =
      analyses.length;

    const hotLeads =
      analyses.filter(
        l => l.temperature === "HOT"
      ).length;

    const warmLeads =
      analyses.filter(
        l => l.temperature === "WARM"
      ).length;

    const coldLeads =
      analyses.filter(
        l => l.temperature === "COLD"
      ).length;

    const highPriority =
      analyses.filter(
        l => l.priority === "HIGH"
      ).length;

    const mediumPriority =
      analyses.filter(
        l => l.priority === "MEDIUM"
      ).length;

    const lowPriority =
      analyses.filter(
        l => l.priority === "LOW"
      ).length;

    const highRisk =
      analyses.filter(
        l => l.risk === "HIGH"
      ).length;

    const mediumRisk =
      analyses.filter(
        l => l.risk === "MEDIUM"
      ).length;

    const lowRisk =
      analyses.filter(
        l => l.risk === "LOW"
      ).length;

    const totalRevenue =
      analyses.reduce(
        (sum, l) =>
          sum + l.revenue,
        0
      );

    const averageScore =
      totalLeads === 0
        ? 0
        : analyses.reduce(
            (sum, l) =>
              sum + l.score,
            0
          ) / totalLeads;

    const averageProbability =
      totalLeads === 0
        ? 0
        : analyses.reduce(
            (sum, l) =>
              sum +
              l.probability,
            0
          ) / totalLeads;

    const ordered =
      [...analyses].sort(
        (a, b) =>
          b.score - a.score
      );

    /*
    ---------------------------------------
    Recomendaciones IA
    ---------------------------------------
    */

    const recommendations: string[] =
      [];

    if (hotLeads > 0) {

      recommendations.push(

        `Contactar hoy ${hotLeads} leads HOT.`

      );

    }

    if (
      coldLeads >
      hotLeads
    ) {

      recommendations.push(

        "Existe una gran cantidad de leads frÃ­os. Iniciar campaña de reactivación."

      );

    }

    if (
      highRisk > 0
    ) {

      recommendations.push(

        `Revisar ${highRisk} oportunidades con alto riesgo.`

      );

    }

    if (
      averageScore >= 80
    ) {

      recommendations.push(

        "El pipeline presenta excelente calidad comercial."

      );

    }
    else if (
      averageScore < 50
    ) {

      recommendations.push(

        "Conviene aumentar la captación de leads de mayor calidad."

      );

    }

    if (
      totalRevenue === 0
    ) {

      recommendations.push(

        "No existe revenue estimado registrado."

      );

    }

    return {

      totalLeads,

      hotLeads,

      warmLeads,

      coldLeads,

      highPriority,

      mediumPriority,

      lowPriority,

      totalRevenue,

      averageScore,

      averageProbability,

      highRisk,

      mediumRisk,

      lowRisk,

      bestLead:
        ordered[0],

      worstLead:
        ordered.at(-1),

      recommendations,

    };

  }

}

export const pipelineAnalyzer =
  new PipelineAnalyzer();
