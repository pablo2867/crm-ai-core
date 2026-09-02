export interface WorkflowStep {

  agentId: string;

  intent: string;

}

export interface WorkflowManifest {

  id: string;

  steps: WorkflowStep[];

}

export const workflows: WorkflowManifest[] = [

  {

    id: "business-analysis",

    steps: [

      {

        agentId: "sales",

        intent: "sales.daily-priorities",

      },

      {

        agentId: "marketing",

        intent: "marketing.campaign",

      },

      {

        agentId: "ceo",

        intent: "ceo.summary",

      },

    ],

  },

  {

    id: "business-growth",

    steps: [

      {

        agentId: "sales",

        intent: "sales.followup",

      },

      {

        agentId: "marketing",

        intent: "marketing.funnel",

      },

      {

        agentId: "ceo",

        intent: "ceo.strategy",

      },

    ],

  },

];