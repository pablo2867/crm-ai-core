import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  Activity,
} from "./types";

export class ActivityService {

  /*
  ---------------------------------------
  ADD ACTIVITY
  ---------------------------------------

  El registro de actividad no bloquea
  la ejecución del workflow.
  */

  add(
    activity: Activity & {
      userId: string;
      organizationId: string;
      workspaceId: string;
    }
  ): void {

    const {
      userId,
      organizationId,
      workspaceId,
      ...rest
    } = activity;

    void Promise.resolve(
      supabaseAdmin
        .from("ai_activity")
        .insert({

          user_id:
            userId,

          
          organization_id:
            organizationId,

          workspace_id:
            workspaceId,

          workflow:
            rest.workflow,

          skill:
            rest.skill,

          status:
            rest.status,

          message:
            rest.message,

          duration_ms:
            rest.durationMs,

          data:
            rest.data,

        })
    )
      .then(({ error }) => {

        if (error) {

          console.error(
            "AI ACTIVITY INSERT:",
            error
          );

        }

      })
      .catch((error: unknown) => {

        console.error(
          "AI ACTIVITY INSERT:",
          error
        );

      });

  }

  async getAll(
    userId: string
  ) {

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("ai_activity")
      .select("*")
      .eq(
        "user_id",
        userId
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(100);

    if (error) {

      console.error(
        "AI ACTIVITY SELECT:",
        error
      );

      return [];

    }

    return data ?? [];

  }

  async clear(
    userId: string
  ) {

    const {
      error,
    } = await supabaseAdmin
      .from("ai_activity")
      .delete()
      .eq(
        "user_id",
        userId
      );

    if (error) {

      console.error(
        "AI ACTIVITY DELETE:",
        error
      );

    }

  }

}

export const activityService =
  new ActivityService();

