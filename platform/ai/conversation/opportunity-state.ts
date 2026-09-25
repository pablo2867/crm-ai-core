import type { CommercialConversationData } from "./commercial-intelligence";

export type OpportunityStage =
  | "new"
  | "interest"
  | "qualification"
  | "objection"
  | "closing"
  | "unknown";

export type InterestLevel =
  | "low"
  | "medium"
  | "high"
  | "unknown";

export interface OpportunityState {
  stage: OpportunityStage;
  interestLevel: InterestLevel;
  purchaseIntent: "low" | "medium" | "high" | "unknown";
  readiness: "low" | "medium" | "high" | "unknown";
  hasObjection: boolean;
  hasBudget: boolean;
  hasNeed: boolean;
  hasQuantity: boolean;
  lastCommercialEvent:
    | "interest"
    | "qualification"
    | "objection"
    | "closing"
    | "general"
    | "unknown";
}

export function deriveOpportunityState(
  data: CommercialConversationData,
): OpportunityState {
  const hasNeed = Boolean(data.need);
  const hasQuantity = Boolean(data.quantity);
  const hasBudget = Boolean(data.budget);
  const hasObjection = data.objections.length > 0;

  let stage: OpportunityStage = "unknown";

  if (hasObjection) {
    stage = "objection";
  } else if (data.price || data.conditions.length > 0) {
    stage = "closing";
  } else if (hasNeed || hasQuantity || data.requirements.length > 0) {
    stage = "qualification";
  } else if (data.productOrService) {
    stage = "interest";
  } else {
    stage = "new";
  }

  const qualificationSignals =
    Number(hasNeed) +
    Number(hasQuantity) +
    Number(hasBudget) +
    Number(data.requirements.length > 0);

  const interestLevel: InterestLevel =
    qualificationSignals >= 3
      ? "high"
      : qualificationSignals >= 1 || data.productOrService
        ? "medium"
        : "unknown";

  const purchaseIntent =
    hasObjection || data.price
      ? "high"
      : qualificationSignals >= 2
        ? "medium"
        : data.productOrService
          ? "low"
          : "unknown";

  const readiness =
    hasNeed && hasQuantity && (hasBudget || data.price)
      ? "high"
      : hasNeed && hasQuantity
        ? "medium"
        : "low";

  const lastCommercialEvent =
    hasObjection
      ? "objection"
      : data.price || data.conditions.length > 0
        ? "closing"
        : hasNeed || hasQuantity
          ? "qualification"
          : data.productOrService
            ? "interest"
            : "general";

  return {
    stage,
    interestLevel,
    purchaseIntent,
    readiness,
    hasObjection,
    hasBudget,
    hasNeed,
    hasQuantity,
    lastCommercialEvent,
  };
}
