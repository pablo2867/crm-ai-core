import {
  diagnosticRegistry,
} from "./registry";

import type {
  DiagnosticIssue,
  DiagnosticRequest,
  DiagnosticResult,
  DiagnosticRuleContext,
  DiagnosticEvidence,
} from "./types";

function calculateHealthScore(
  issues: DiagnosticIssue[]
): number {

  let score = 100;

  for (const issue of issues) {

    switch (issue.severity) {

      case "critical":
        score -= 30;
        break;

      case "high":
        score -= 20;
        break;

      case "medium":
        score -= 10;
        break;

      case "low":
        score -= 5;
        break;

      case "info":
        score -= 0;
        break;

    }

  }

  return Math.max(
    0,
    Math.min(
      100,
      score
    )
  );

}

function calculateStatus(
  score: number,
  issues: DiagnosticIssue[]
):
  DiagnosticResult["status"] {

  if (
    issues.some(
      issue =>
        issue.severity === "critical"
    )
  ) {

    return "critical";

  }

  if (score < 70) {

    return "warning";

  }

  return "healthy";

}

export class DiagnosticOrchestrator {

  async run(
    request: DiagnosticRequest
  ): Promise<DiagnosticResult> {

    const startedAt =
      new Date().toISOString();

    const started =
      performance.now();

    const issues: DiagnosticIssue[] = [];

    const evidence:
      DiagnosticEvidence[] = [];

    const rules =
      diagnosticRegistry
        .getAll()
        .filter(
          rule => {

            if (
              request.block &&
              rule.block !== request.block
            ) {
              return false;
            }

            if (
              request.scope === "system"
            ) {
              return true;
            }

            if (
              request.scope === "block" &&
              request.block
            ) {
              return (
                rule.block ===
                request.block
              );
            }

            if (
              request.scope === "module" &&
              request.module
            ) {
              return (
                rule.block ===
                request.module
              );
            }

            return true;

          }
        );

    const context:
      DiagnosticRuleContext = {

      request,

      evidence,

    };

    for (const rule of rules) {

      try {

        const issue =
          await rule.check(
            context
          );

        if (issue) {

          issues.push(
            issue
          );

          evidence.push(
            ...issue.evidence
          );

        }

      } catch (error) {

        issues.push({

          id:
            `${rule.id}.execution-error`,

          block:
            rule.block,

          category:
            rule.category,

          severity:
            "high",

          title:
            `Error ejecutando regla ${rule.id}`,

          description:
            error instanceof Error
              ? error.message
              : "Error desconocido ejecutando diagnóstico.",

          rootCause:
            "La regla de diagnóstico no pudo completarse.",

          evidence: [],

          affectedComponents: [
            rule.block,
          ],

          repairable:
            false,

          risk:
            "high",

        });

      }

    }

    const healthScore =
      calculateHealthScore(
        issues
      );

    const status =
      calculateStatus(
        healthScore,
        issues
      );

    const completedAt =
      new Date().toISOString();

    return {

      success:
        true,

      status,

      startedAt,

      completedAt,

      durationMs:
        Number(
          (
            performance.now() -
            started
          ).toFixed(2)
        ),

      scope:
        request.scope,

      healthScore,

      issues,

      evidence,

      repairPlans: [],

      validation: {

        status:
          "pending",

        results: [],

      },

    };

  }

}

export const diagnosticOrchestrator =
  new DiagnosticOrchestrator();

