import {
  executiveInsights,
} from "./insights";

import {
  recommendationEngine,
} from "./recommendations";

import type {
  BusinessContext,
} from "@/platform/context";

import type {
  ExecutiveReport,
} from "./types";

export class ExecutiveAnalyzer {

  analyze(
    context: BusinessContext
  ): ExecutiveReport {

    return {

      score:
        context.health.score,

      insights:
        executiveInsights.generate(
          context
        ),

      recommendations:
        recommendationEngine.generate(
          context
        ),

    };

  }

}

export const executiveAnalyzer =
  new ExecutiveAnalyzer();