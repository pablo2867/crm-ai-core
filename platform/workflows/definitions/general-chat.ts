import {
  Workflow,
} from "../types";

export const generalChatWorkflow: Workflow = {

  id: "general-chat",

  name: "General Chat Workflow",

  metadata: {

    enabled: true,

    priority: 1,

    category: "general",

    supportedIntents: [

      "copilot",

    ],

    tags: [

      "general",

      "chat",

      "assistant",

    ],

  },

  steps: [

    {

      id: crypto.randomUUID(),

      skill: "chat-response",

      input: {},

    },

  ],

};