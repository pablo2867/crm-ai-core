import type { CommercialConversationData } from "./commercial-intelligence";

export type QualificationLevel =
  | "unqualified"
  | "partial"
  | "qualified";

export type QualificationAction =
  | "continue_discovery"
  | "present_offer"
  | "prepare_proposal"
  | "move_to_closing";

export interface QualificationIntelligence {
  level: QualificationLevel;
  productKnown: boolean;
  needKnown: boolean;
  quantityKnown: boolean;
  budgetKnown: boolean;
  requirementsKnown: boolean;
  missingInformation: string[];
  qualificationScore: number;
  recommendedAction: QualificationAction;
}

export function analyzeQualification(
  data: CommercialConversationData,
): QualificationIntelligence {
  const productKnown = Boolean(data.productOrService);
  const needKnown = Boolean(data.need);
  const quantityKnown = Boolean(data.quantity);
  const budgetKnown = Boolean(data.budget);
  const requirementsKnown =
    data.requirements.length > 0;

  const signals = [
    productKnown,
    needKnown,
    quantityKnown,
    budgetKnown,
    requirementsKnown,
  ];

  const qualificationScore =
    signals.filter(Boolean).length * 20;

  const missingInformation: string[] = [];

  if (!productKnown) {
    missingInformation.push(
      "producto o servicio",
    );
  }

  if (!needKnown) {
    missingInformation.push(
      "necesidad",
    );
  }

  if (!quantityKnown) {
    missingInformation.push(
      "cantidad",
    );
  }

  if (!budgetKnown) {
    missingInformation.push(
      "presupuesto",
    );
  }

  if (!requirementsKnown) {
    missingInformation.push(
      "requisitos",
    );
  }

  const level: QualificationLevel =
    qualificationScore >= 80
      ? "qualified"
      : qualificationScore >= 40
        ? "partial"
        : "unqualified";

  let recommendedAction: QualificationAction;

  if (qualificationScore < 40) {
    recommendedAction = "continue_discovery";
  } else if (!productKnown || !needKnown) {
    recommendedAction = "continue_discovery";
  } else if (qualificationScore < 80) {
    recommendedAction = "present_offer";
  } else if (!budgetKnown || !requirementsKnown) {
    recommendedAction = "prepare_proposal";
  } else {
    recommendedAction = "move_to_closing";
  }

  return {
    level,
    productKnown,
    needKnown,
    quantityKnown,
    budgetKnown,
    requirementsKnown,
    missingInformation,
    qualificationScore,
    recommendedAction,
  };
}