import {
  moduleBuilder,
} from "@/platform/module-builder";

import {
  financialAnalysisCapability,
} from "@/platform/capabilities";

import {
  financialRoutes,
} from "./routes";

import {
  financialSkills,
} from "./skills";

import {
  financialWorkflows,
} from "./workflows";

export const financialModule =
  moduleBuilder.create({

    id: "financial",

    name: "Financial Intelligence",

    version: "1.0.0",

    description:
      "Financial Intelligence module for AI CORE Platform.",

    enabled: true,

    capabilities: [
      "ai",
      "analytics",
      "runtime",
      "skills",
      "workflow",
    ],

    routes: financialRoutes,

    entities: [],

    workflows: financialWorkflows,

    skills: financialSkills,

    runtimeCapabilities: [
      financialAnalysisCapability,
    ],

    permissions: [],

  });