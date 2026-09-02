import type {
  Workflow,
} from "@/platform/workflows";

export const salesFollowupWorkflow: Workflow = {

  id: "sales-followup",

  name: "Sales Followup",


  steps: [
    {
      id: "find-best-lead",
      skill: "find-best-lead",
    },
    {
      id: "generate-followup",
      skill: "generate-followup",
    },
  ],

  metadata: {
    enabled: true,
    priority: 90,
    category: "sales",

    supportedIntents: [
      "sales.followup",
    ],

    tags: [
      "sales",
      "followup",
    ],

    capabilityId:
      "sales-followup",
  },

};
