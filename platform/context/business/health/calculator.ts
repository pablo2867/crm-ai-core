import type {
  BusinessHealth,
} from "../types";

export interface HealthCalculationInput {
  conversionRate: number;
}

export class BusinessHealthCalculator {

  calculate({
    conversionRate,
  }: HealthCalculationInput): BusinessHealth {

    if (conversionRate >= 40) {

      return {

        score: 100,

        status: "excellent",

      };

    }

    if (conversionRate >= 25) {

      return {

        score: 80,

        status: "good",

      };

    }

    if (conversionRate >= 10) {

      return {

        score: 60,

        status: "warning",

      };

    }

    return {

      score: 30,

      status: "critical",

    };

  }

}

export const businessHealthCalculator =
  new BusinessHealthCalculator();