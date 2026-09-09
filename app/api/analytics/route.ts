import { Permissions } from "@/platform/auth/permissions";
import { authEngine } from "@/platform/auth";
import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  analyticsService,
} from "@/platform/services/analytics";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

export async function GET() {

  try {

    const supabase =
      await createClient();

    const {

      data: { user },

    } =
      await supabase.auth.getUser();

    await authEngine.requirePermission(Permissions.CRM_ANALYTICS_VIEW);

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

    /*
    ---------------------------------------
    Analytics Dashboard
    ---------------------------------------
    */

    const analytics:
      AnalyticsDashboardDTO =
        await analyticsService.getDashboard(

          user.id

        );

    return NextResponse.json({

      success: true,

      analytics,

      generatedAt:
        new Date().toISOString(),

      version:
        "1.0.0",

    });

  } catch (error) {

    console.error(

      "ANALYTICS API:",

      error

    );

    return NextResponse.json(

      {

        success: false,

        error:
          "No fue posible obtener las métricas.",

      },

      {

        status: 500,

      }

    );

  }

}

