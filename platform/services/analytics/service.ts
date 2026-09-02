import {
  telemetryRepository,
} from "@/platform/telemetry/repository/supabase";

import type {
  AnalyticsDashboardDTO,
} from "@/platform/analytics/dto";

export class AnalyticsService {

  async getDashboard(
    userId: string
  ): Promise<AnalyticsDashboardDTO> {

    const [

      summary,

      topAgents,

      timeline,

      recentExecutions,

    ] = await Promise.all([

      telemetryRepository.summary(
        userId
      ),

      telemetryRepository.findTopAgents(
        userId
      ),

      telemetryRepository.findTimeline(
        userId
      ),

      telemetryRepository.findRecent(
        userId,
        20
      ),

    ]);

    return {

      summary: {

        ...summary,

        mostUsedAgent:

          topAgents.length > 0

            ? topAgents[0].agent

            : undefined,

      },

      topAgents,

      timeline,

      recentExecutions,

    };

  }

}

export const analyticsService =
  new AnalyticsService();