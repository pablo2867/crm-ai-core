import type {
  Workflow,
} from "../types";

export const salesLeadRankingWorkflow: Workflow = {

  id:
    "sales-lead-ranking",

  name:
    "Sales Lead Ranking Workflow",

  metadata: {

    enabled:
      true,

    priority:
      95,

    category:
      "sales",

    supportedIntents: [

      "sales.lead-ranking",

    ],

    tags: [

      "sales",

      "lead",

      "ranking",

      "closing",

      "analysis",

    ],

    capabilityId:
      "sales-lead-ranking",

  },

  steps: [

    {

      id:
        crypto.randomUUID(),

      skill:
        "sales-lead-ranking",

      input:
        {},

    },

  ],

};
