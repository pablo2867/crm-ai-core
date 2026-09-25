import {
  commercialProposalEngine,
} from "@/platform/ai/conversation/commercial-proposal";

import type {
  Capability,
  CapabilityRequest,
  CapabilityResult,
} from "../types";

import type {
  CommercialProposalResult,
} from "@/platform/ai/conversation/commercial-proposal";

import type {
  CommercialConversationData,
} from "@/platform/ai/conversation/commercial-intelligence";

export const commercialProposalCapability: Capability = {
  id: "commercial-proposal",

  name: "Commercial Proposal",

  metadata: {
    category: "sales",
    priority: 100,
    supportedIntents: ["whatsapp.proposal"],
    tags: [
      "sales",
      "commercial",
      "proposal",
      "quotation",
      "whatsapp",
    ],
    modules: [
      "sales",
      "whatsapp",
    ],
  },

  async execute(
    request: CapabilityRequest,
  ): Promise<
    CapabilityResult<CommercialProposalResult>
  > {
    const input = request.input ?? {};

    const commercialData =
      input.commercialData as
        | CommercialConversationData
        | undefined;

    if (!commercialData) {
      return {
        success: false,
        message:
          "No se recibió información comercial suficiente para preparar la propuesta.",
      };
    }

    const result =
      await commercialProposalEngine.generate({
        userId: request.userId ?? "",
        organizationId:
          request.organizationId ?? "",
        workspaceId:
          request.workspaceId ?? "",
        customerName:
          typeof input.customerName === "string"
            ? input.customerName
            : null,
        data: commercialData,
      });

    return {
      success: result.success,

      message: result.success
        ? "Propuesta comercial preparada correctamente."
        : `No fue posible preparar la propuesta: ${result.reason}.`,

      data: result,
    };
  },
};