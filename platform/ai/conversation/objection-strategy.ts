import type {
  CommercialObjection,
} from "./objection-intelligence";

export type ObjectionStrategyType =
  | "value"
  | "clarification"
  | "requirement"
  | "trust"
  | "clarify";

export interface ObjectionStrategy {
  type: ObjectionStrategyType;
  objective: string;
  nextAction: string;
}

export function resolveObjectionStrategy(
  objection: CommercialObjection,
): ObjectionStrategy {

  switch (objection.type) {

    case "price":
      return {
        type: "value",
        objective:
          "Comprender la preocupación económica y contextualizar el valor de la propuesta.",
        nextAction:
          "Explorar presupuesto o presentar una alternativa comercial disponible.",
      };

    case "conditions":
      return {
        type: "clarification",
        objective:
          "Identificar qué condición comercial genera la objeción.",
        nextAction:
          "Solicitar aclaración sobre la condición que necesita ajustarse.",
      };

    case "requirements":
      return {
        type: "requirement",
        objective:
          "Identificar el requisito que la propuesta no está cubriendo.",
        nextAction:
          "Preguntar qué característica o requisito específico necesita.",
      };

    case "trust":
      return {
        type: "trust",
        objective:
          "Reducir la incertidumbre del cliente.",
        nextAction:
          "Identificar la duda concreta y responder únicamente con información disponible.",
      };

    case "unknown":
    default:
      return {
        type: "clarify",
        objective:
          "Comprender la causa concreta de la objeción.",
        nextAction:
          "Solicitar al cliente que explique qué aspecto le preocupa.",
      };
  }
}
