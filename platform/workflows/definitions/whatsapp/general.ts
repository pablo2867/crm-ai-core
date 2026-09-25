import type { Workflow } from "../../types";

export const whatsappGeneralWorkflow: Workflow = {
  id: "whatsapp-general",
  name: "WhatsApp General",
  steps: [
    {
      id: "whatsapp-response",
      skill: "whatsapp-response",
    },
  ],
  metadata: {
    enabled: true,
    priority: 70,
    category: "whatsapp",
    supportedIntents: [
      "whatsapp.general",
      "whatsapp.followup",
    ],
    tags: ["whatsapp", "conversation", "general"],
  },
};


