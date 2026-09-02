import { Workflow } from "../types";

export const dailyPrioritiesWorkflow: Workflow = {
  id: "daily-priorities",

  name: "Daily Priorities Workflow",

  metadata: {
    enabled: true,

    priority: 90,

    category: "sales",

    supportedIntents: [
      "sales.daily-priorities",
    ],

    tags: [
      "daily",
      "priorities",
      "dashboard",
    ],

    capabilityId: "daily-priorities",
  },

  steps: [
    {
      id: crypto.randomUUID(),

      skill: "daily-priorities",

      input: {},
    },
  ],
};