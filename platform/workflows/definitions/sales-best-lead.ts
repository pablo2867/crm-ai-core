import type {
  Workflow,
} from "@/platform/workflows";

export const salesBestLeadWorkflow: Workflow = {

  id:
    "sales-best-lead",

  name:
    "Sales Best Lead Workflow",

  metadata: {

    enabled:
      true,

    priority:
      100,

    category:
      "sales",

    supportedIntents: [],

    tags: [

      "lead",
      "legacy",
    ],

    capabilityId:
      "find-best-lead",

  },

  steps: [

    {

      id:
        crypto.randomUUID(),

      skill:
        "find-best-lead",

      input:
        {},

    },

  ],

};

