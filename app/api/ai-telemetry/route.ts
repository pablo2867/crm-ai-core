import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  telemetryEngine,
} from "@/platform/telemetry";

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

    const records =
      telemetryEngine.all();

    const summary =
      telemetryEngine.summary();

    return NextResponse.json({

      success: true,

      telemetry:
        records,

      summary,

      totalExecutions:
        summary.totalExecutions,

      successfulExecutions:
        summary.successfulExecutions,

      failedExecutions:
        summary.failedExecutions,

      averageDuration:
        summary.averageDuration,

    });

  } catch (error) {

    console.error(

      "AI TELEMETRY:",

      error

    );

    return NextResponse.json(

      {

        success: false,

        error:
          "No fue posible obtener la telemetría.",

      },

      {

        status: 500,

      }

    );

  }

}
