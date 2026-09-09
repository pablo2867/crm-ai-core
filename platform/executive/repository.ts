import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import {
  analyticsService,
} from "@/platform/services/analytics";
import {
  tenantEngine,
} from "@/platform/tenant";

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

    
    const tenant =
      await tenantEngine.getTenant(
        userId
      );
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
        )        .eq(
          "organization_id",
          tenant.organizationId
        )
        .eq(
          "workspace_id",
          tenant.workspaceId
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

