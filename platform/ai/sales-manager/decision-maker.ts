import type {
  LeadAnalysis,
  SalesDecision,
} from "./types";

export class SalesDecisionMaker {

  decide(
    analysis: LeadAnalysis[]
  ): SalesDecision[] {

    return analysis.map((item) => ({

      lead:
        item.lead,

      action:
        "followup",

      confidence:
        item.priority / 100,

      reason:
        item.risk > 60
          ? "Lead en riesgo; requiere seguimiento inmediato."
          : "Lead con oportunidad comercial.",

    }));

  }

}

export const salesDecisionMaker =
  new SalesDecisionMaker();
