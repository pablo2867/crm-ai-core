import type {
  ScoreCapabilitiesRequest,
  CapabilityScore,
  CapabilityScoreBreakdown,
} from "./types";

const WEIGHTS = {

  intent: 1,

  priority: 1,

  context: 1,

} as const;

export function scoreCapabilities({

  capabilities,

  context,

}: ScoreCapabilitiesRequest): CapabilityScore[] {

  return capabilities.map(

    capability => {

      const metadata =
        capability.metadata;

      /*
      ---------------------------------------
      Intent
      ---------------------------------------
      */

      const intentScore =

        metadata?.supportedIntents.includes(

          context.intent ?? ""

        )

          ? 50

          : 0;

      /*
      ---------------------------------------
      Priority
      ---------------------------------------
      */

      const priorityScore =
        metadata?.priority ?? 0;

      /*
      ---------------------------------------
      Context
      ---------------------------------------
      */

      const contextScore =
        context.workflowId
          ? 10
          : 0;

      const breakdown: CapabilityScoreBreakdown = {

        intent:
          intentScore * WEIGHTS.intent,

        priority:
          priorityScore * WEIGHTS.priority,

        context:
          contextScore * WEIGHTS.context,

        total: 0,

      };

      breakdown.total =

        breakdown.intent +

        breakdown.priority +

        breakdown.context;

      return {

        capability,

        score:
          breakdown.total,

        breakdown,

      };

    }

  );

}