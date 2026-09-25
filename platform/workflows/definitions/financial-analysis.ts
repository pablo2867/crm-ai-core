import type { Workflow } from "../types";

export const financialAnalysisWorkflow: Workflow = {
  id: "financial-analysis",
  name: "Financial Analysis",
  steps: [
    {
      id: "financial-analysis",
      capability: "financial.analysis",
    },
  ],
  metadata: {
    enabled: true,
    advanced: true,
    priority: 90,
    category: "financial",
    supportedIntents: [
      "financial.analysis",
      "financial",
    ],
    tags: [
      "financial",
      "analysis",
      "finance",
    ],
    capabilityId: "financial.analysis",
  },
};