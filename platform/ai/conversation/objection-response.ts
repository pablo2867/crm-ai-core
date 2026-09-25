import type {
  CommercialObjection,
} from "./objection-intelligence";

import {
  resolveObjectionStrategy,
} from "./objection-strategy";

export interface ObjectionResponse {
  text: string;
  strategyType: string;
  objectionType: string;
}

export function generateObjectionResponse(
  objection: CommercialObjection,
): ObjectionResponse {

  const strategy =
    resolveObjectionStrategy(objection);

  switch (strategy.type) {

    case "value":
      return {
        text:
          "Entiendo la preocupación por el precio. ¿Tienes un presupuesto aproximado para esta compra?",
        strategyType: strategy.type,
        objectionType: objection.type,
      };

    case "clarification":
      return {
        text:
          "Entiendo. ¿Qué condición específica necesitarías revisar o ajustar?",
        strategyType: strategy.type,
        objectionType: objection.type,
      };

    case "requirement":
      return {
        text:
          "Entiendo. ¿Qué característica o requisito específico necesitas que cumplamos?",
        strategyType: strategy.type,
        objectionType: objection.type,
      };

    case "trust":
      return {
        text:
          "Claro. ¿Qué aspecto específico te genera duda para poder ayudarte con esa información?",
        strategyType: strategy.type,
        objectionType: objection.type,
      };

    case "clarify":
    default:
      return {
        text:
          "Entiendo. ¿Qué aspecto de la propuesta te genera mayor preocupación?",
        strategyType: strategy.type,
        objectionType: objection.type,
      };
  }
}
