import {
  moduleBuilder,
} from "@/platform/module-builder";

import {
  salesFollowupCapability,
  commandCenterCapability,
  commercialProposalCapability,
} from "@/platform/capabilities";

import {
  crmRoutes,
} from "./routes";

import {
  crmSkills,
} from "./skills";

import {
  crmWorkflows,
} from "./workflows";

export const crmModule =
  moduleBuilder.create({

    id: "crm",

    name: "CRM AI CORE",

    version: "1.0.0",

    description:
      "Core CRM module for AI CORE Platform.",

    enabled: true,

    capabilities: [
      "ai",
      "analytics",
      "dashboard",
      "memory",
      "notifications",
      "runtime",
      "skills",
      "workflow",
    ],

    routes: crmRoutes,

    entities: [],

    workflows: crmWorkflows,

    skills: crmSkills,

    runtimeCapabilities: [

      salesFollowupCapability,

      commandCenterCapability,

      commercialProposalCapability,

    ],

    permissions: [],

  });
