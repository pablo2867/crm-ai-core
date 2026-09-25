import { aiConversationContextBuilder } from "./builder";

export interface CommercialConversationData {
  productOrService: string | null;
  customerType: string | null;
  quantity: string | null;
  need: string | null;
  requirements: string[];
  budget: string | null;
  price: string | null;
  conditions: string[];
  objections: string[];
  knownData: string[];
  missingData: string[];
}

export type DiscoveryTarget =
  | "product_or_service"
  | "need"
  | "quantity"
  | "requirements"
  | "budget"
  | "none";

export interface CommercialIntelligenceRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  contactPhone: string;
  contactName?: string | null;
  message: string;
  limit?: number;
}

export interface CommercialIntelligenceResult {
  success: boolean;
  conversationId: string;
  messageCount: number;
  data: CommercialConversationData;
  discoveryTarget: DiscoveryTarget;
  discoveryQuestion: string | null;
  provider: string;
  model: string;
  duration: number;
  error?: string;
  errorCode?: string;
}

function extractQuantity(text: string): string | null {
  const match = text.match(
    /\b(\d+(?:[.,]\d+)?)\s*(personas?|person|unidades?|unidad|piezas?|pieza|bidones?|bidón|bidon|cajas?|caja|paquetes?|paquete|bultos?|bulto|rollos?|rollo|galones?|galón|galon|botellas?|botella|cubetas?|cubeta|garrafones?|garrafón|garrafon|sacos?|saco|pares?|par|docenas?|docena|kg|kilos?|kilogramos?|litros?|litro|l|ml|mililitros?|m2|metros?|meses?|horas?)\b/i,
  );

  return match ? match[0].trim() : null;
}

function extractBudget(text: string): string | null {
  const match = text.match(
    /\b(?:presupuesto|budget)\s*(?:de|es|:)?\s*(\$?\s*[\d.,]+(?:\s*(?:mxn|pesos?|usd|d[oó]lares?))?)/i,
  );

  return match ? match[1].trim() : null;
}

function extractPrice(text: string): string | null {
  const match = text.match(
    /\b(?:cuesta|precio|costo|coste|vale|valor)\s*(?:es|de|:)?\s*(\$?\s*[\d.,]+(?:\s*(?:mxn|pesos?|usd|d[oó]lares?))?)/i,
  );

  return match ? match[1].trim() : null;
}

function extractRequirements(text: string): string[] {
  const requirements: string[] = [];

  const patterns = [
    /(?:debe tener|debe ser|que tenga|con)\s+([^.\n!?]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[1]?.trim();

      if (
        value &&
        value.length > 2 &&
        !requirements.some(
          (item) => item.toLowerCase() === value.toLowerCase(),
        )
      ) {
        requirements.push(value);
      }
    }
  }

  return requirements;
}

function extractConditions(text: string): string[] {
  const conditions: string[] = [];

  const patterns = [
    /(?:para|entrega|entregar|fecha|horario|cuando|cuándo)\s+([^.\n!?]+)/gi,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[0]?.trim();

      if (
        value &&
        value.length > 4 &&
        !conditions.some(
          (item) => item.toLowerCase() === value.toLowerCase(),
        )
      ) {
        conditions.push(value);
      }
    }
  }

  return conditions;
}

function extractCommercialData(
  history: string,
  currentMessage: string,
): CommercialConversationData {
  const currentText = currentMessage.trim();
  const text = currentText
    ? currentText + "\n" + history
    : history;

  const lower = text.toLowerCase();

  const data: CommercialConversationData = {
    productOrService: null,
    customerType: null,
    quantity: extractQuantity(text),
    need: null,
    requirements: extractRequirements(text),
    budget: extractBudget(text),
    price: extractPrice(text),
    conditions: extractConditions(text),
    objections: [],
    knownData: [],
    missingData: [],
  };

  if (
    lower.includes("limpieza") ||
    lower.includes("limpiar") ||
    lower.includes("servicio de limpieza")
  ) {
    data.productOrService = "servicio de limpieza";
  }

  if (
    lower.includes("oficina") ||
    lower.includes("empresa") ||
    lower.includes("negocio")
  ) {
    data.customerType = lower.includes("oficina")
      ? "oficina"
      : lower.includes("empresa")
        ? "empresa"
        : "negocio";
  }

  if (
    lower.includes("me interesa") ||
    lower.includes("necesito") ||
    lower.includes("busco") ||
    lower.includes("quiero")
  ) {
    const needMatch = text.match(
      /(?:me interesa|necesito|busco|quiero)\s+([^.\n!?]+)/i,
    );

    if (needMatch) {
      const candidate = needMatch[1].trim();

      const withoutQuantity = candidate
        .replace(
          /^\d+(?:[.,]\d+)?\s*(personas?|person|unidades?|unidad|piezas?|pieza|bidones?|bidón|bidon|cajas?|caja|paquetes?|paquete|bultos?|bulto|rollos?|rollo|galones?|galón|galon|botellas?|botella|cubetas?|cubeta|garrafones?|garrafón|garrafon|sacos?|saco|pares?|par|docenas?|docena|kg|kilos?|kilogramos?|litros?|litro|l|ml|mililitros?|m2|metros?|meses?|horas?)\b\s*/i,
          "",
        )
        .trim();

      if (
        withoutQuantity &&
        withoutQuantity.toLowerCase() !==
          data.quantity?.toLowerCase()
      ) {
        data.need = withoutQuantity;
      }
    }
  }

  if (
    lower.includes("¿cuánto cuesta") ||
    lower.includes("cuánto cuesta") ||
    lower.includes("cuanto cuesta") ||
    lower.includes("precio") ||
    lower.includes("costo") ||
    lower.includes("coste")
  ) {
    const currentLower =
      currentText.toLowerCase();

    const detectedObjections: string[] = [];

    const addObjection = (
      value: string,
    ) => {
      if (
        value &&
        !detectedObjections.some(
          item =>
            item.toLowerCase() ===
            value.toLowerCase(),
        )
      ) {
        detectedObjections.push(value);
      }
    };

    if (
      currentLower.includes("¿cuánto cuesta") ||
      currentLower.includes("cuánto cuesta") ||
      currentLower.includes("cuanto cuesta") ||
      currentLower.includes("precio") ||
      currentLower.includes("costo") ||
      currentLower.includes("coste") ||
      currentLower.includes("está muy caro") ||
      currentLower.includes("esta muy caro") ||
      currentLower.includes("es muy caro") ||
      currentLower.includes("demasiado caro") ||
      currentLower.includes("muy costoso") ||
      currentLower.includes("no tengo presupuesto") ||
      currentLower.includes("sin presupuesto") ||
      currentLower.includes("se sale de mi presupuesto") ||
      currentLower.includes("fuera de mi presupuesto")
    ) {
      addObjection("precio/costo");
    }

    if (
      currentLower.includes("no me convienen las condiciones") ||
      currentLower.includes("no me sirven las condiciones") ||
      currentLower.includes("esas condiciones no me sirven") ||
      currentLower.includes("no estoy de acuerdo con las condiciones")
    ) {
      addObjection("condiciones");
    }

    if (
      currentLower.includes("no cumple lo que necesito") ||
      currentLower.includes("no cumple con lo que necesito") ||
      currentLower.includes("no tiene lo que necesito") ||
      currentLower.includes("necesito otra característica") ||
      currentLower.includes("necesito otra caracteristica")
    ) {
      addObjection("requisitos");
    }

    if (
      currentLower.includes("no confío") ||
      currentLower.includes("no confio") ||
      currentLower.includes("no estoy seguro") ||
      currentLower.includes("no estoy segura") ||
      currentLower.includes("tengo dudas") ||
      currentLower.includes("necesito comprobarlo")
    ) {
      addObjection("confianza");
    }

    if (
      currentLower.includes("necesito pensarlo") ||
      currentLower.includes("déjame pensarlo") ||
      currentLower.includes("dejame pensarlo") ||
      currentLower.includes("lo voy a consultar") ||
      currentLower.includes("necesito consultarlo") ||
      currentLower.includes("tengo que consultarlo")
    ) {
      addObjection("necesito pensarlo");
    }

    data.objections.push(
      ...detectedObjections,
    );
  }

  if (data.quantity) {
    data.knownData.push(`Cantidad: ${data.quantity}`);
  }

  if (data.productOrService) {
    data.knownData.push(
      `Producto/servicio: ${data.productOrService}`,
    );
  }

  if (data.customerType) {
    data.knownData.push(
      `Tipo de cliente: ${data.customerType}`,
    );
  }

  if (data.need) {
    data.knownData.push(`Necesidad: ${data.need}`);
  }

  if (data.requirements.length > 0) {
    data.knownData.push(
      `Requisitos: ${data.requirements.join(", ")}`,
    );
  }

  if (data.budget) {
    data.knownData.push(`Presupuesto: ${data.budget}`);
  }

  if (data.price) {
    data.knownData.push(`Precio mencionado: ${data.price}`);
  }

  if (data.conditions.length > 0) {
    data.knownData.push(
      `Condiciones: ${data.conditions.join(", ")}`,
    );
  }

  if (!data.productOrService) {
    data.missingData.push("producto o servicio");
  }

  if (!data.need) {
    data.missingData.push("necesidad específica");
  }

  if (!data.quantity) {
    data.missingData.push("cantidad");
  }

  if (data.requirements.length === 0) {
    data.missingData.push("requisitos");
  }

  if (!data.budget) {
    data.missingData.push("presupuesto");
  }

  return data;
}

function resolveDiscovery(
  data: CommercialConversationData,
): {
  target: DiscoveryTarget;
  question: string | null;
} {
  if (!data.productOrService) {
    return {
      target: "product_or_service",
      question:
        "¿Qué producto o servicio estás buscando?",
    };
  }

  if (!data.need) {
    return {
      target: "need",
      question:
        "¿Qué necesitas resolver o qué uso le darás?",
    };
  }

  if (!data.quantity) {
    return {
      target: "quantity",
      question:
        "¿Qué cantidad necesitas?",
    };
  }

  if (data.requirements.length === 0) {
    return {
      target: "requirements",
      question:
        "¿Tienes algún requisito o característica específica que necesites?",
    };
  }

  if (!data.budget) {
    return {
      target: "budget",
      question:
        "¿Tienes un presupuesto aproximado para esta compra?",
    };
  }

  return {
    target: "none",
    question: null,
  };
}

export class CommercialConversationIntelligence {
  async extract(
    request: CommercialIntelligenceRequest,
  ): Promise<CommercialIntelligenceResult> {
    const startedAt = Date.now();

    try {
      const context =
        await aiConversationContextBuilder.build({
          userId: request.userId,
          organizationId: request.organizationId,
          workspaceId: request.workspaceId,
          conversationId: request.conversationId,
          contactPhone: request.contactPhone,
          contactName: request.contactName,
          limit: request.limit ?? 20,
        });

      const history = context.messages
        .map(
          (message) =>
            `${message.role === "user" ? "Cliente" : "Asistente"}: ${message.content}`,
        )
        .join("\n");

      const data = extractCommercialData(
        history,
        request.message,
      );

      const discovery = resolveDiscovery(data);

      return {
        success: true,
        conversationId: context.conversationId,
        messageCount: context.messageCount,
        data,
        discoveryTarget: discovery.target,
        discoveryQuestion: discovery.question,
        provider: "local-rule-engine",
        model: "deterministic",
        duration: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        success: false,
        conversationId: request.conversationId,
        messageCount: 0,
        data: {
          productOrService: null,
          customerType: null,
          quantity: null,
          need: null,
          requirements: [],
          budget: null,
          price: null,
          conditions: [],
          objections: [],
          knownData: [],
          missingData: [],
        },
        discoveryTarget: "product_or_service",
        discoveryQuestion:
          "¿Qué producto o servicio estás buscando?",
        provider: "local-rule-engine",
        model: "deterministic",
        duration: Date.now() - startedAt,
        error:
          error instanceof Error
            ? error.message
            : "COMMERCIAL_INTELLIGENCE_ERROR",
        errorCode: "COMMERCIAL_INTELLIGENCE_ERROR",
      };
    }
  }
}

export const commercialConversationIntelligence =
  new CommercialConversationIntelligence();



