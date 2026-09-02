import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  analyticsService,
} from "@/platform/services/analytics";

export interface ExecutiveRepositoryData {

  leads: unknown[];

  analytics: Awaited<
    ReturnType<
      typeof analyticsService.getDashboard
    >
  >;

}

export class ExecutiveRepository {

  async load(
    userId: string
  ): Promise<ExecutiveRepositoryData> {

    const [

      leadsResult,

      analytics,

    ] = await Promise.all([

      supabaseAdmin

        .from("leads")

        .select("*")

        .eq(
          "user_id",
          userId
        ),

      analyticsService.getDashboard(
        userId
      ),

    ]);

    return {

      leads:
        leadsResult.data ?? [],

      analytics,

    };

  }

}

export const executiveRepository =
  new ExecutiveRepository();