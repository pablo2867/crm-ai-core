import {
  opportunityDetector,
} from "./opportunities";

import {
  riskDetector,
} from "./risks";

import {
  recommendationEngine,
} from "./recommendations";

import type {
  ExecutiveInsightReport,
} from "./types";

import type {
  BusinessContext,
} from "@/platform/context/business";

export class ExecutiveIntelligenceEngine {

  analyze(
    business: BusinessContext
  ): ExecutiveInsightReport {

    /*
    ---------------------------------------
    Oportunidades
    ---------------------------------------
    */

    const opportunities =
      opportunityDetector.detect(
        business
      );

    /*
    ---------------------------------------
    Riesgos
    ---------------------------------------
    */

    const risks =
      riskDetector.detect(
        business
      );

    /*
    ---------------------------------------
    Recomendaciones
    ---------------------------------------
    */

    const recommendations =
      recommendationEngine.generate(

        opportunities,

        risks

      );

    return {

      business,

      opportunities,

      risks,

      recommendations,

    };

  }

}

export const executiveIntelligenceEngine =
  new ExecutiveIntelligenceEngine();