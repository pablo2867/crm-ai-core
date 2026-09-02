import type {
  ContextLead,
} from "@/platform/context";

import {
  businessMetricsCalculator,
} from "./calculator";

export class BusinessMetricsProvider {

  async get(
    leads: ContextLead[]
  ) {

    return businessMetricsCalculator.calculate(
      leads
    );

  }

}

export const businessMetricsProvider =
  new BusinessMetricsProvider();