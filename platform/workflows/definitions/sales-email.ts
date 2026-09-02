import type {
  Workflow,
} from "@/platform/workflows";

export const salesEmailWorkflow: Workflow = {

  id:
    "sales-email",

  name:
    "Sales Email",

  steps: [

    {
      id:
        "find-best-lead",

      skill:
        "find-best-lead",
    },

    {
      id:
        "generate-followup",

      skill:
        "generate-followup",
    },

  ],

  metadata: {

    enabled:
      true,

    priority:
      80,

    category:
      "sales",

    supportedIntents: [],

    tags: [

      "sales",

      "email",

    ],

    capabilityId:
      "sales-email",

  },

};
