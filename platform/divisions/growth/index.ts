import type {
  DivisionDefinition,
} from "../contracts";

export const growthDivision: DivisionDefinition = {
  id: "growth",

  name: "Growth Division",

  description:
    "Responsable del crecimiento comercial mediante marketing, embudos, campañas y automatización.",

  capabilities: [
    {
      id: "marketing",
      name: "Marketing",
    },
    {
      id: "funnels",
      name: "Funnels",
    },
    {
      id: "campaigns",
      name: "Campaigns",
    },
    {
      id: "nurturing",
      name: "Lead Nurturing",
    },
    {
      id: "content",
      name: "Content Generation",
    },
  ],

  agents: [
    "marketing-agent",
  ],

  workflows: [
    "campaign-workflow",
    "funnel-workflow",
    "nurturing-workflow",
  ],

  skills: [
    "generate-copy",
    "generate-email",
    "generate-landing",
    "segment-leads",
  ],
};
