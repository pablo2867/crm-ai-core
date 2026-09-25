import type { CommercialConversationData } from "./commercial-intelligence";

export type ObjectionType =
  | "price"
  | "conditions"
  | "requirements"
  | "trust"
  | "unknown";

export interface CommercialObjection {
  type: ObjectionType;
  text: string;
  severity: "low" | "medium" | "high";
  status: "open";
  resolved: false;
}

export interface ObjectionIntelligenceResult {
  hasObjection: boolean;
  count: number;
  objections: CommercialObjection[];
}

function resolveObjectionType(
  objection: string,
): ObjectionType {
  const value = objection.toLowerCase();

  if (
    value.includes("precio") ||
    value.includes("costo") ||
    value.includes("presupuesto")
  ) {
    return "price";
  }

  if (
    value.includes("condición") ||
    value.includes("condiciones")
  ) {
    return "conditions";
  }

  if (
    value.includes("requisito") ||
    value.includes("requerimiento")
  ) {
    return "requirements";
  }

  if (
    value.includes("confianza") ||
    value.includes("seguridad") ||
    value.includes("no estoy seguro") ||
    value.includes("no estoy segura") ||
    value.includes("tengo dudas") ||
    value.includes("necesito comprobarlo") ||
    value.includes("necesito pensarlo") ||
    value.includes("déjame pensarlo") ||
    value.includes("dejame pensarlo") ||
    value.includes("lo voy a consultar") ||
    value.includes("necesito consultarlo") ||
    value.includes("tengo que consultarlo")
  ) {
    return "trust";
  }

  return "unknown";
}

export function analyzeObjections(
  data: CommercialConversationData,
): ObjectionIntelligenceResult {
  const objections =
    data.objections.map(
      (objection): CommercialObjection => {
        const type = resolveObjectionType(objection);

        return {
          type,
          text: objection,
          severity:
            type === "price"
              ? "medium"
              : "low",
          status: "open",
          resolved: false,
        };
      },
    );

  return {
    hasObjection: objections.length > 0,
    count: objections.length,
    objections,
  };
}

