import type {
  NextBestAction,
  NextBestActionRequest,
} from "./types";

export function buildExplanation(

  action: NextBestAction,

  request: NextBestActionRequest

): string {

  const lead =
    request.lead;

  const score =
    lead.aiScore ?? 0;

  const probability =
    lead.probability ?? 0;

  const temperature =
    lead.temperature ?? "UNKNOWN";

  return [

    `La mejor acción seleccionada es "${action.title}".`,

    `Prioridad: ${action.priority}.`,

    `Confianza: ${action.confidence}%.`,

    `AI Score: ${score}.`,

    `Probabilidad de cierre: ${probability}%.`,

    `Temperatura del lead: ${temperature}.`,

    action.description,

  ].join(" ");

}
