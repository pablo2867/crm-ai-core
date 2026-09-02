import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase-server";

import {
  activityService,
} from "@/platform/activity";

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

          message:
            "Usuario no autenticado.",

        },

        {

          status: 401,

        }

      );

    }

    const activities =
      await activityService.getAll(
        user.id
      );

    const formatted =
      activities.map(
        (activity: {
  id: string | number;
  workflow: string;
  skill: string;
  status: string;
  message: string;
  duration_ms?: number | null;
  created_at: string;
  data?: unknown;
}) => ({

          id:
            activity.id,

          workflow:
            activity.workflow,

          skill:
            activity.skill,

          status:
            activity.status,

          message:
            activity.message,

          durationMs:
            activity.duration_ms,

          createdAt:
            activity.created_at,

          data:
            activity.data,

        })
      );

    return NextResponse.json({

      success: true,

      total:
        formatted.length,

      activities:
        formatted,

    });

  } catch (error) {

    console.error(
      "AI ACTIVITY ERROR:",
      error
    );

    return NextResponse.json(

      {

        success: false,

        message:
          "No fue posible obtener la actividad del sistema.",

      },

      {

        status: 500,

      }

    );

  }

}
