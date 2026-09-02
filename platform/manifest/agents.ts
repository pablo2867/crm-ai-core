export interface AgentManifest {

  id: string;

  name: string;

  enabled: boolean;

  priority: number;

  intents: string[];

}

export const agents: AgentManifest[] = [

  {
    id: "ceo",

    name: "CEO Agent",

    enabled: true,

    priority: 110,

    intents: [
      "ceo.summary",
      "ceo.strategy",
      "business.analysis",
      "business.growth",
      "business.health",
    ],

  },

  {
    id: "sales",

    name: "Sales Agent",

    enabled: true,

    priority: 100,

    intents: [
      "sales.followup",
      "sales.task",
      "sales.daily-priorities",
      "sales.lead-ranking",
    ],

  },

  {
    id: "marketing",

    name: "Marketing Agent",

    enabled: true,

    priority: 90,

    intents: [
      "marketing.email",
      "marketing.campaign",
      "marketing.funnel",
      "marketing.nurturing",
    ],

  },

  {
    id: "finance",

    name: "Finance Agent",

    enabled: true,

    priority: 80,

    intents: [
      "finance.cashflow",
      "finance.forecast",
      "finance.report",
    ],

  },

  {
    id: "support",

    name: "Support Agent",

    enabled: true,

    priority: 70,

    intents: [
      "support.ticket",
      "support.customer",
    ],

  },

  {
    id: "hr",

    name: "HR Agent",

    enabled: true,

    priority: 60,

    intents: [
      "hr.recruitment",
      "hr.performance",
    ],

  },

];
