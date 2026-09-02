import {
  readdir,
  readFile,
} from "node:fs/promises";

import {
  join,
} from "node:path";

import type {
  DiagnosticRule,
  DiagnosticIssue,
} from "../../types";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

async function collectRouteFiles(
  directory: string,
): Promise<string[]> {

  const entries =
    await readdir(
      directory,
      {
        withFileTypes: true,
      }
    );

  const files: string[] = [];

  for (const entry of entries) {

    const fullPath =
      join(
        directory,
        entry.name
      );

    if (entry.isDirectory()) {

      files.push(
        ...await collectRouteFiles(
          fullPath
        )
      );

      continue;
    }

    if (
      entry.isFile() &&
      entry.name === "route.ts"
    ) {

      files.push(
        fullPath
      );

    }

  }

  return files;

}

export const apiRouteIntegrityRule:
  DiagnosticRule = {

  id:
    "api.route-integrity",

  block:
    "api",

  category:
    "api",

  description:
    "Verifica que las rutas App Router de la API contengan al menos un handler HTTP válido.",

  async check() {

    const apiDirectory =
      join(
        process.cwd(),
        "app",
        "api"
      );

    let routeFiles: string[];

    try {

      routeFiles =
        await collectRouteFiles(
          apiDirectory
        );

    } catch (error) {

      const issue:
        DiagnosticIssue = {

        id:
          "api.route-integrity.discovery-error",

        block:
          "api",

        category:
          "api",

        severity:
          "high",

        title:
          "No fue posible inspeccionar las rutas API",

        description:
          error instanceof Error
            ? error.message
            : "Error desconocido leyendo app/api.",

        rootCause:
          "El Diagnostic Engine no pudo acceder al árbol de rutas API.",

        evidence: [],

        affectedComponents: [
          "app/api",
        ],

        repairable:
          false,

        risk:
          "high",

      };

      return issue;

    }

    const invalidRoutes:
      string[] = [];

    for (
      const routeFile of routeFiles
    ) {

      let content: string;

      try {

        content =
          await readFile(
            routeFile,
            "utf8"
          );

      } catch {

        invalidRoutes.push(
          `${routeFile}: no pudo leerse.`
        );

        continue;

      }

      const hasHandler =
        HTTP_METHODS.some(
          method =>
            new RegExp(
              `export\\s+async\\s+function\\s+${method}\\s*\\(`
            ).test(
              content
            )
        ) ||
        HTTP_METHODS.some(
          method =>
            new RegExp(
              `export\\s+function\\s+${method}\\s*\\(`
            ).test(
              content
            )
        );

      if (
        !hasHandler
      ) {

        invalidRoutes.push(
          `${routeFile}: no contiene un handler HTTP reconocido.`
        );

      }

    }

    if (
      invalidRoutes.length === 0
    ) {

      return null;

    }

    return {

      id:
        "api.route-integrity.failed",

      block:
        "api",

      category:
        "api",

      severity:
        "high",

      title:
        "Integridad de rutas API comprometida",

      description:
        invalidRoutes.join(" "),

      rootCause:
        "Una o más rutas app/api no contienen un handler HTTP válido.",

      evidence: [

        {

          type:
            "code",

          source:
            "app/api",

          description:
            `Se analizaron ${routeFiles.length} rutas API.`,

          value:
            {

              routeCount:
                routeFiles.length,

              invalidRouteCount:
                invalidRoutes.length,

              invalidRoutes,

            },

        },

      ],

      affectedComponents: [
        "app/api",
        "route-handlers",
      ],

      repairable:
        false,

      risk:
        "high",

    } satisfies DiagnosticIssue;

  },

};
