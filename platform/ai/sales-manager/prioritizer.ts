import type {
  LeadAnalysis,
} from "./types";

export class SalesPrioritizer {

  prioritize(
    analysis: LeadAnalysis[]
  ): LeadAnalysis[] {

    return [...analysis].sort(

      (a, b) =>

        b.priority - a.priority

    );

  }

}

export const salesPrioritizer =
  new SalesPrioritizer();