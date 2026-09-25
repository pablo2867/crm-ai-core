import type { Workflow } from "../../types";

export const whatsappObjectionWorkflow: Workflow = {
  id: "whatsapp-objection",
  name: "WhatsApp Objection",
  steps: [
    {
      id: "whatsapp-response",
      skill: "whatsapp-response",
    },
  ],
  metadata: {
    enabled: true,
    priority: 90,
    category: "whatsapp",
    supportedIntents: ["whatsapp.objection"],
    tags: ["whatsapp", "conversation", "objection", "sales"],
  },
};

