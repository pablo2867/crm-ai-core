import {
  capabilityRegistry,
} from "@/platform/capabilities/registry";

import type {
  DiagnosticRule,
  DiagnosticIssue,
} from "../../types";

export const capabilityIntegrityRule:
  DiagnosticRule = {

  id:
    "capability.integrity",

  block:
    "capability",

  category:
    "architecture",

  description:
    "Verifica la integridad de las capabilities registradas en CRM AI CORE.",

  check() {

    const capabilities =
      capabilityRegistry;

    const issues:
      string[] = [];

    for (
      const capability of capabilities
    ) {

      if (
        !capability.id ||
        !capability.id.trim()
      ) {

        issues.push(
          "Existe una Capability con id vacío."
        );

      }

      if (
        !capability.name ||
        !capability.name.trim()
      ) {

        issues.push(
          `La Capability '${capability.id}' no tiene name.`
        );

      }

      if (
        typeof capability.execute !==
        "function"
      ) {

        issues.push(
          `La Capability '${capability.id}' no tiene una función execute válida.`
        );

      }

      const metadata =
        capability.metadata;

      if (metadata) {

        if (
          !metadata.category ||
          !metadata.category.trim()
        ) {

          issues.push(
            `La Capability '${capability.id}' tiene metadata.category vacío.`
          );

        }

        if (
          !Number.isFinite(
            metadata.priority
          )
        ) {

          issues.push(
            `La Capability '${capability.id}' tiene una prioridad inválida.`
          );

        }

        if (
          !Array.isArray(
            metadata.supportedIntents
          )
        ) {

          issues.push(
            `La Capability '${capability.id}' tiene supportedIntents inválido.`
          );

        }

        if (
          !Array.isArray(
            metadata.tags
          )
        ) {

          issues.push(
            `La Capability '${capability.id}' tiene tags inválidos.`
          );

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
        "capability.integrity.failed",

      block:
        "capability",

      category:
        "architecture",

      severity:
        "high",

      title:
        "Integridad de capabilities comprometida",

      description:
        issues.join(" "),

      rootCause:
        "Una o más capabilities registradas no cumplen el contrato esperado.",

      evidence: [

        {

          type:
            "code",

          source:
            "platform/capabilities/registry.ts",

          description:
            `Se analizaron ${capabilities.length} capabilities registradas.`,

          value:
            {

              capabilityCount:
                capabilities.length,

              detectedIssues:
                issues.length,

              capabilities:
                capabilities.map(
                  capability =>
                    capability.id
                ),

            },

        },

      ],

      affectedComponents: [

        "capability",

        "capability-registry",

        "workflow",

      ],

      repairable:
        false,

      risk:
        "high",

    };

    return issue;

  },

};
