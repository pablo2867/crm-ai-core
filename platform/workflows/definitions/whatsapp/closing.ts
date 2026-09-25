import type { Workflow } from "../../types";

export const whatsappClosingWorkflow: Workflow = {
  id: "whatsapp-closing",
  name: "WhatsApp Closing",
  steps: [
    {
      id: "whatsapp-response",
      skill: "whatsapp-response",
    },
  ],
  metadata: {
    enabled: true,
    priority: 95,
    category: "whatsapp",
    supportedIntents: ["whatsapp.closing"],
    tags: ["whatsapp", "conversation", "closing", "sales"],
  },
};

