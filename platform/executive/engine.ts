import type {
  ExecutiveDashboardDTO,
} from "./dto";

import {
  executiveRepository,
} from "./repository";

import {
  executiveScorer,
} from "./scorer";

import {
  executiveAnalyzer,
} from "./analyzer";

export class ExecutiveEngine {

  async execute(
    userId: string
  ): Promise<ExecutiveDashboardDTO> {

    /*
    ---------------------------------------
    Load Business Data
    ---------------------------------------
    */

    const data =
      await executiveRepository.load(
        userId
      );

    /*
    ---------------------------------------
    Calculate Business Health
    ---------------------------------------
    */

    const health =
      executiveScorer.calculate(
        data
      );

    /*
    ---------------------------------------
    Generate Executive Analysis
    ---------------------------------------
    */

    const analysis =
      executiveAnalyzer.analyze(
        health
      );

    /*
    ---------------------------------------
    Final DTO
    ---------------------------------------
    */

    return {

      summary:
        analysis.summary,

      health,

      risks:
        analysis.risks,

      opportunities:
        analysis.opportunities,

      recommendations:
        analysis.recommendations,

    };

  }

}

export const executiveEngine =
  new ExecutiveEngine();