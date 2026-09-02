import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  authEngine,
} from "@/platform/auth";

import {
  diagnosticPipeline,
} from "@/platform/diagnostics/pipeline";

export async function POST(
  request: NextRequest
) {

  try {

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    const body =
      await request.json()
        .catch(
          () => ({})
        );

    const result =
      await diagnosticPipeline.run({

        scope:
          body.scope === "block" ||
          body.scope === "module"
            ? body.scope
            : "system",

        mode:
          body.mode === "quick"
            ? "quick"
            : "full",

        block:
          typeof body.block === "string"
            ? body.block
            : undefined,

        module:
          typeof body.module === "string"
            ? body.module
            : undefined,

        tenant: {

          userId:
            user.id,

          organizationId:
            tenant.organizationId,

          workspaceId:
            tenant.workspaceId,

        },

        options: {

          includeDatabase:
            body.options?.includeDatabase ??
            true,

          includeCode:
            body.options?.includeCode ??
            false,

          includeRuntime:
            body.options?.includeRuntime ??
            false,

          includeArchitecture:
            body.options?.includeArchitecture ??
            false,

        },

      });

    return NextResponse.json({

      success:
        true,

      /*
      ---------------------------------------
      Compatibilidad
      ---------------------------------------
      */

      diagnostic:
        result.diagnostic,

      /*
      ---------------------------------------
      Diagnostic Pipeline
      ---------------------------------------
      */

      classifications:
        result.classifications,

      rootCauses:
        result.rootCauses,

      repairPlans:
        result.repairPlans,

      policy:
        result.policy,

      repairs:
        result.repairs,

      validations:
        result.validations,

    });

  } catch (error) {

    console.error(
      "DIAGNOSTICS API ERROR:",
      error
    );

    return NextResponse.json(

      {

        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Error ejecutando diagnóstico.",

      },

      {

        status:
          500,

      }

    );

  }

}
