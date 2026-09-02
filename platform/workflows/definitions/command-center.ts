import type {
  Workflow,
} from "../types";

export const commandCenterWorkflow: Workflow = {

  id: "command-center",

  name: "AI Command Center",

  metadata: {

    enabled: true,

    priority: 100,

    category: "dashboard",

    supportedIntents: [

      "dashboard.command-center",

    ],

    tags: [

      "dashboard",

      "executive",

      "command-center",

    ],

    capabilityId: "command-center",

  },

  steps: [

    {

      id: "command-center",

      capability: "command-center",

    },

  ],

};