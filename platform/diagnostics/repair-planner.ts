import type {
  DiagnosticIssue,
  RepairPlan,
} from "./types";

import type {
  RootCauseAnalysis,
} from "./root-cause";

function requiresApproval(
  issue: DiagnosticIssue
): boolean {

  if (
    issue.risk === "critical" ||
    issue.risk === "high"
  ) {
    return true;
  }

  if (
    issue.category === "tenant" ||
    issue.category === "database"
  ) {
    return true;
  }

  return false;

}

export class RepairPlanner {

  createPlan(
    issue: DiagnosticIssue,
    analysis: RootCauseAnalysis
  ): RepairPlan {

    const approvalRequired =
      requiresApproval(
        issue
      );

    const strategy =
      issue.repairable
        ? `Corregir la causa raíz detectada: ${analysis.rootCause}`
        : `Requiere intervención manual para la causa raíz: ${analysis.rootCause}`;

    const actions = issue.repairable
      ? [
          {
            id:
              `${issue.id}.repair`,

            type:
              "runtime" as const,

            target:
              issue.affectedComponents.join(", "),

            description:
              strategy,

            reversible:
              true,

            validation: [
              "Ejecutar diagnóstico nuevamente.",
              "Verificar que el issue desaparezca.",
              "Verificar que no aparezcan nuevos errores.",
            ],

          },
        ]
      : [];

    const validationSteps = [

      "Ejecutar nuevamente las reglas de diagnóstico.",

      "Comparar los issues antes y después de la reparación.",

      "Confirmar que el health score no disminuya.",

    ];

    const rollbackSteps = [

      "Restaurar el estado anterior.",

      "Revertir cualquier acción reversible aplicada.",

      "Reejecutar las validaciones.",

    ];

    return {

      issueId:
        issue.id,

      strategy,

      actions,

      risk:
        issue.risk,

      requiresApproval:
        approvalRequired,

      validationSteps,

      rollbackSteps,

    };

  }

  createPlans(
    issues: DiagnosticIssue[],
    analyses: RootCauseAnalysis[]
  ): RepairPlan[] {

    const analysisMap =
      new Map(
        analyses.map(
          analysis => [
            analysis.issueId,
            analysis,
          ]
        )
      );

    return issues
      .filter(
        issue =>
          issue.repairable
      )
      .map(
        issue => {

          const analysis =
            analysisMap.get(
              issue.id
            );

          if (!analysis) {

            return null;

          }

          return this.createPlan(
            issue,
            analysis
          );

        }
      )
      .filter(
        (
          plan
        ): plan is RepairPlan =>
          plan !== null
      );

  }

}

export const repairPlanner =
  new RepairPlanner();
