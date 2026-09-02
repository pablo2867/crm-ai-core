import type {
  PipelineAnalysis,
} from "../pipeline-analyzer";

import type {
  SalesStrategy,
} from "./types";

export class SalesStrategyEngine {

  generate(

    pipeline: PipelineAnalysis

  ): SalesStrategy {

    const priorities: string[] = [];

    const actions: string[] = [];

    const warnings: string[] = [];

    const opportunities: string[] = [];

    /*
    ---------------------------------------
    Prioridades
    ---------------------------------------
    */

    if (pipeline.bestLead) {

      priorities.push(

        `Priorizar contacto con ${pipeline.bestLead.name}.`

      );

    }

    /*
    ---------------------------------------
    Acciones
    ---------------------------------------
    */

    actions.push(

      ...pipeline.recommendations

    );

    /*
    ---------------------------------------
    Riesgos
    ---------------------------------------
    */

    if (pipeline.highRisk > 0) {

      warnings.push(

        `${pipeline.highRisk} oportunidades presentan alto riesgo.`

      );

    }

    /*
    ---------------------------------------
    Oportunidades
    ---------------------------------------
    */

    if (

      pipeline.totalRevenue > 0

    ) {

      opportunities.push(

        `Revenue potencial estimado: $${pipeline.totalRevenue.toLocaleString()}.`

      );

    }

    if (

      pipeline.hotLeads > 0

    ) {

      opportunities.push(

        `${pipeline.hotLeads} leads HOT disponibles para cierre.`

      );

    }

    return {

      priorities,

      actions,

      warnings,

      opportunities,

    };

  }

}

export const salesStrategyEngine =
  new SalesStrategyEngine();