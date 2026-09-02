import {
  skillRegistry,
} from "@/platform/skills/registry";

import type {
  DiagnosticRule,
  DiagnosticIssue,
} from "../../types";

export const skillIntegrityRule:
  DiagnosticRule = {

  id:
    "skill.integrity",

  block:
    "skill",

  category:
    "skill",

  description:
    "Verifica la integridad de las Skills registradas en CRM AI CORE.",

  check() {

    const skills =
      skillRegistry.getAll();

    const issues:
      string[] = [];

    for (const skill of skills) {

      if (
        !skill.id ||
        !skill.id.trim()
      ) {

        issues.push(
          "Existe una Skill con id vacío."
        );

      }

      if (
        !skill.name ||
        !skill.name.trim()
      ) {

        issues.push(
          `La Skill '${skill.id}' no tiene name.`
        );

      }

      if (
        !skill.description ||
        !skill.description.trim()
      ) {

        issues.push(
          `La Skill '${skill.id}' no tiene description.`
        );

      }

      if (
        typeof skill.execute !==
        "function"
      ) {

        issues.push(
          `La Skill '${skill.id}' no tiene una función execute válida.`
        );

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
        "skill.integrity.failed",

      block:
        "skill",

      category:
        "skill",

      severity:
        "high",

      title:
        "Integridad de Skills comprometida",

      description:
        issues.join(" "),

      rootCause:
        "Una o más Skills registradas no cumplen el contrato SkillDefinition.",

      evidence: [

        {

          type:
            "code",

          source:
            "platform/skills/registry.ts",

          description:
            `Se analizaron ${skills.length} Skills registradas.`,

          value:
            {

              skillCount:
                skills.length,

              detectedIssues:
                issues.length,

              skills:
                skills.map(
                  skill => skill.id
                ),

            },

        },

      ],

      affectedComponents: [

        "skill",

        "skill-registry",

        "skill-engine",

      ],

      repairable:
        false,

      risk:
        "high",

    };

    return issue;

  },

};
