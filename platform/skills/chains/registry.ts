import type {
  SkillChainDefinition,
} from "./types";

export const skillChainRegistry: SkillChainDefinition[] = [

  {

    id: "sales-followup",

    name: "Sales Follow-up",

    description:
      "Cadena completa para seguimiento comercial.",

    steps: [

      {

        skillId:
          "find-best-lead",

      },

      {

        skillId:
          "generate-followup",

      },

      {

        skillId:
          "create-task",

      },

    ],

  },

];