import {
  workflowRegistry,
} from "@/platform/workflows/registry";

import {
  skillRegistry,
} from "@/platform/skills/registry";

import {
  capabilityRegistry,
} from "@/platform/capabilities/registry";

import type {
  DiagnosticRule,
  DiagnosticIssue,
} from "../../types";

export const workflowIntegrityRule:
  DiagnosticRule = {

  id:
    "workflow.integrity",

  block:
    "workflow",

  category:
    "workflow",

  description:
    "Verifica la integridad estructural de workflows, skills y capabilities registradas.",

  check() {

    const issues:
      string[] = [];

    const workflows =
      workflowRegistry.getAll();

    for (const workflow of workflows) {

      if (
        workflow.steps.length === 0
      ) {

        issues.push(
          `Workflow '${workflow.id}' no contiene steps.`
        );

        continue;

      }

      for (const step of workflow.steps) {

        const hasSkill =
          typeof step.skill === "string" &&
          step.skill.trim().length > 0;

        const hasCapability =
          typeof step.capability === "string" &&
          step.capability.trim().length > 0;

        if (
          !hasSkill &&
          !hasCapability
        ) {

          issues.push(
            `Workflow '${workflow.id}', step '${step.id}' no tiene skill ni capability.`
          );

          continue;

        }

        if (
          hasSkill &&
          !skillRegistry.has(
            step.skill as string
          )
        ) {

          issues.push(
            `Workflow '${workflow.id}', step '${step.id}' referencia skill inexistente '${step.skill}'.`
          );

        }

        if (
          hasCapability
        ) {

          const capabilityExists =
            capabilityRegistry.some(
              capability =>
                capability.id ===
                step.capability
            );

          if (!capabilityExists) {

            issues.push(
              `Workflow '${workflow.id}', step '${step.id}' referencia capability inexistente '${step.capability}'.`
            );

          }

        }

      }

    }

    if (
      issues.length === 0
    ) {

      return null;

    }

    const issue:
      DiagnosticIssue = {

      id:
        "workflow.integrity.failed",

      block:
        "workflow",

      category:
        "workflow",

      severity:
        "high",

      title:
        "Integridad de workflows comprometida",

      description:
        issues.join(" "),

      rootCause:
        "Uno o más workflows contienen referencias inválidas o una estructura incompleta.",

      evidence: [

        {

          type:
            "code",

          source:
            "platform/workflows/registry.ts",

          description:
            `Se analizaron ${workflows.length} workflows registrados.`,

          value:
            {

              workflowCount:
                workflows.length,

              detectedIssues:
                issues.length,

            },

        },

      ],

      affectedComponents: [

        "workflow",

        "workflow-registry",

        "skill-registry",

        "capability-registry",

      ],

      repairable:
        false,

      risk:
        "high",

    };

    return issue;

  },

};
