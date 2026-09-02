import type {
  DivisionDefinition,
} from "./contracts";

export const salesDivision: DivisionDefinition = {
  id: "sales",

  name: "Sales Division",

  description:
    "Gestiona todo el ciclo comercial del CRM AI CORE.",

  capabilities: [
    {
      id: "lead-management",
      name: "Lead Management",
    },
    {
      id: "pipeline",
      name: "Pipeline Management",
    },
    {
      id: "followup",
      name: "AI Follow-up",
    },
    {
      id: "forecast",
      name: "Revenue Forecast",
    },
  ],

  agents: [
    "sales",
  ],

  workflows: [
    "sales-best-lead",
  ],

  skills: [
    "find-best-lead",
    "create-task",
    "generate-followup",
  ],
};