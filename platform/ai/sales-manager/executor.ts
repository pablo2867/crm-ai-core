import {
  actionExecutor,
} from "@/platform/actions";

import type {
  SalesDecision,
  SalesExecutionResult,
} from "./types";

export class SalesExecutor {

  async execute(

    userId: string,

    decisions: SalesDecision[],

    organizationId: string,

    workspaceId: string

  ): Promise<SalesExecutionResult> {

    let executed = 0;

    const executionResults = [];

    for (const decision of decisions) {

      const result =
        await actionExecutor.execute({

          action:
            decision.action,

          userId,

          organizationId,

          workspaceId,

          leadId:
            decision.lead.id,

        });

      executionResults.push({
        decision,
        result,
      });

      if (result.success) {

        executed++;

      }

    }

    return {

      success:
        executionResults.every(
          item => item.result.success
        ),

      analyzed:
        decisions.length,

      executed,

      decisions,

    };

  }

}

export const salesExecutor =
  new SalesExecutor();

