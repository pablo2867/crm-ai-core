import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  authEngine,
} from "@/platform/auth";

import {
  runtimeEngine,
} from "@/platform/runtime";

import {
  runtimeHistoryEngine,
} from "@/platform/runtime/history";

import {
  aiHealthEngine,
} from "@/platform/ai-health";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Usuario no autenticado.",
        },
        {
          status: 401,
        }
      );

    }

    const tenant =
      await authEngine.getTenant();

    const runtime =
      await runtimeEngine.execute({

        message:
          "AI Command Center",

        intent:
          "dashboard.command-center",

        userId:
          user.id,

        organizationId:
          tenant.organizationId,

        workspaceId:
          tenant.workspaceId,

        context: {},

      });

    const runtimeMetric =
      runtime.metrics.find(
        (metric) =>
          metric.id === "Runtime"
      );

    const runtimeDuration =
      runtimeMetric?.duration ?? 0;

    const healthReport =
      aiHealthEngine.generateReport({

        components: [

          {
            id: "runtime",
            name: "Runtime Engine",
            averageDuration:
              runtimeDuration,
            executions: 1,
            successRate:
              runtime.validation?.valid
                ? 100
                : 0,
          },

          {
            id: "workflow",
            name: "Workflow Engine",
            averageDuration:
              runtimeDuration,
            executions: 1,
            successRate:
              runtime.workflow
                ? 100
                : 0,
          },

          {
            id: "decision",
            name: "Decision Engine",
            averageDuration:
              runtimeDuration,
            executions: 1,
            successRate:
              runtime.decision
                ? 100
                : 0,
          },

        ],

      });

    return NextResponse.json({

      success: true,

      decision:
        runtime.decision ?? null,

      validation:
        runtime.validation ?? null,

      workflow:
        runtime.workflow ?? null,

      plan:
        runtime.plan ?? null,

      runtime,

      timeline:
        runtime.steps,

      metrics:
        runtime.metrics,

      health:
        healthReport,

      history:
        runtimeHistoryEngine.all(),

      historyStats:
        runtimeHistoryEngine.stats(),

    });

  } catch (error) {

    console.error(
      "AI COMMAND CENTER:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible obtener el estado del AI Command Center.",
      },
      {
        status: 500,
      }
    );

  }

}

