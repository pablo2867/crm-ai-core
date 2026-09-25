import type { Workflow } from "../../types";

export const whatsappProposalWorkflow: Workflow = {
  id: "whatsapp-proposal",

  name: "WhatsApp Commercial Proposal",

  steps: [
    {
      id: "commercial-proposal",
      capability: "commercial-proposal",
    },
  ],

  metadata: {
    enabled: true,
    priority: 100,
    category: "whatsapp",

    supportedIntents: [
      "whatsapp.proposal",
    ],

    tags: [
      "whatsapp",
      "conversation",
      "proposal",
      "quotation",
      "sales",
    ],

    capabilityId: "commercial-proposal",
  },
};
