import type {
  CEOPlan,
  CEORequest,
} from "./types";

export class CEOPlanner {

  createPlan(
    request: CEORequest
  ): CEOPlan {

    return {

      objective:
        request.message,

      priorities: [

        "Analizar el estado del negocio",

        "Priorizar oportunidades",

        "Detectar riesgos",

      ],

    };

  }

}

export const ceoPlanner =
  new CEOPlanner();