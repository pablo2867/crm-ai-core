import type {
  NextBestAction,
  NextBestActionRequest,
} from "./types";

export function buildRules(
  request: NextBestActionRequest
): NextBestAction[] {

  const {

    aiScore = 0,

    probability = 0,

    temperature = "COLD",

  } = request.lead;

  const actions: NextBestAction[] = [];

  /*
  ---------------------------------------
  Hot Lead
  ---------------------------------------
  */

  if (

    temperature === "HOT" ||

    aiScore >= 90 ||

    probability >= 85

  ) {

    actions.push({

      id:
        "call-now",

      title:
        "Llamar inmediatamente",

      description:
        "Existe una alta probabilidad de cierre.",

      priority:
        100,

      confidence:
        98,

      capabilityId:
        "sales-task",

      workflowId:
        "sales-task",

    });

  }

  /*
  ---------------------------------------
  Warm Lead
  ---------------------------------------
  */

  else if (

    aiScore >= 70 ||

    probability >= 60

  ) {

    actions.push({

      id:
        "personal-followup",

      title:
        "Enviar seguimiento personalizado",

      description:
        "El lead muestra interés y requiere seguimiento.",

      priority:
        80,

      confidence:
        90,

      capabilityId:
        "sales-followup",

      workflowId:
        "sales-followup",

    });

  }

  /*
  ---------------------------------------
  Cold Lead
  ---------------------------------------
  */

  else {

    actions.push({

      id:
        "nurturing",

      title:
        "Iniciar campaña de nurturing",

      description:
        "El lead necesita maduración antes de una venta.",

      priority:
        50,

      confidence:
        75,

      capabilityId:
        "sales.next-best-action",

      workflowId:
        "marketing-campaign",

    });

  }

  return actions;

}
