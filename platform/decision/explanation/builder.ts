import type {
  DecisionExplanation,
  DecisionExplanationRequest,
} from "./types";

export function buildDecisionExplanation(
  request: DecisionExplanationRequest
): DecisionExplanation {

  const orderedReasons =
    [...request.reasons].sort(
      (a, b) => b.weight - a.weight
    );

  const topReasons =
    orderedReasons
      .slice(0, 3)
      .map(reason => reason.title);

  let summary =
    `Se seleccionó "${request.workflowName}" con una puntuación de ${request.finalScore}. `;

  if (topReasons.length > 0) {

    summary +=
      `Los principales factores fueron: ${topReasons.join(", ")}.`;

  } else {

    summary +=
      "No se registraron factores relevantes.";

  }

  if (request.intent) {

    summary +=
      ` Intent detectado: ${request.intent}.`;

  }

  summary +=
    ` Confianza: ${(request.confidence * 100).toFixed(0)}%.`;

  return {

    workflowId:
      request.workflowId,

    workflowName:
      request.workflowName,

    finalScore:
      request.finalScore,

    confidence:
      request.confidence,

    reasons:
      orderedReasons,

    summary,

  };

}
