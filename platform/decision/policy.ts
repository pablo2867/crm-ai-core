import type {
  RankedWorkflow,
} from "./ranker/types";

export const DecisionPolicyConfig = {
  minimumScore: 1,
  minimumConfidence: 0.25,
  minimumMargin: 5,
} as const;

export type DecisionStatus =
  | "accepted"
  | "review"
  | "tie";

export interface DecisionPolicyResult {
  status: DecisionStatus;
  requiresReview: boolean;
  margin: number;
  confidence: number;
  minimumScore: number;
  minimumConfidence: number;
  minimumMargin: number;
  reason: string;
}

export function evaluateDecisionPolicy(
  winner: RankedWorkflow,
  ranking: RankedWorkflow[],
  confidence: number,
): DecisionPolicyResult {
  const secondScore =
    ranking[1]?.score ?? 0;

  const margin =
    Math.max(
      0,
      winner.score - secondScore,
    );

  const tied =
    ranking.filter(
      (item) =>
        item.score === winner.score,
    ).length > 1;

  if (tied) {
    return {
      status: "tie",
      requiresReview: true,
      margin,
      confidence,
      minimumScore:
        DecisionPolicyConfig.minimumScore,
      minimumConfidence:
        DecisionPolicyConfig.minimumConfidence,
      minimumMargin:
        DecisionPolicyConfig.minimumMargin,
      reason:
        "Hay empate entre workflows candidatos; requiere revisión.",
    };
  }

  if (
    winner.score <
      DecisionPolicyConfig.minimumScore ||
    confidence <
      DecisionPolicyConfig.minimumConfidence ||
    margin <
      DecisionPolicyConfig.minimumMargin
  ) {
    return {
      status: "review",
      requiresReview: true,
      margin,
      confidence,
      minimumScore:
        DecisionPolicyConfig.minimumScore,
      minimumConfidence:
        DecisionPolicyConfig.minimumConfidence,
      minimumMargin:
        DecisionPolicyConfig.minimumMargin,
      reason:
        "La decisión no supera los umbrales mínimos de confianza o separación.",
    };
  }

  return {
    status: "accepted",
    requiresReview: false,
    margin,
    confidence,
    minimumScore:
      DecisionPolicyConfig.minimumScore,
    minimumConfidence:
      DecisionPolicyConfig.minimumConfidence,
    minimumMargin:
      DecisionPolicyConfig.minimumMargin,
    reason:
      "La decisión supera los umbrales mínimos de selección.",
  };
}
