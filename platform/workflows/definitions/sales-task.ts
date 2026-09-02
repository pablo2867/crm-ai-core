import type {
  Workflow,
} from "@/platform/workflows";

export const salesTaskWorkflow: Workflow = {

  id: "sales-task",

  name: "Sales Task",


  steps: [
    {
      id: "find-best-lead",
      skill: "find-best-lead",
    },
    {
      id: "create-task",
      skill: "create-task",
    },
  ],

  metadata: {
    enabled: true,
    priority: 85,
    category: "sales",

    supportedIntents: [
      "sales.task",
    ],

    tags: [
      "sales",
      "task",
    ],

    capabilityId:
      "sales-task",
  },

};
