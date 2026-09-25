import type { Workflow } from "../../types";

export const whatsappInterestWorkflow: Workflow = {
  id: "whatsapp-interest",
  name: "WhatsApp Interest",
  steps: [
    {
      id: "whatsapp-response",
      skill: "whatsapp-response",
    },
  ],
  metadata: {
    enabled: true,
    priority: 85,
    category: "whatsapp",
    supportedIntents: ["whatsapp.interest"],
    tags: ["whatsapp", "conversation", "interest", "sales"],
  },
};

