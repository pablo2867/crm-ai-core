import type {
  Workflow,
} from "../types";

export const marketingCampaignWorkflow: Workflow = {
  id: "marketing-campaign",

  name: "Marketing Campaign Workflow",

  metadata: {
    enabled: true,

    priority: 90,

    category: "marketing",

    supportedIntents: [
      "marketing.campaign",
      "marketing.email",
      "marketing.funnel",
      "marketing.nurturing",
    ],

    tags: [
      "marketing",
      "campaign",
      "email",
      "funnel",
      "nurturing",
    ],
  },

  steps: [
    {
      id: "generate-email",
      skill: "generate-email",
      input: {},
    },
  ],
};