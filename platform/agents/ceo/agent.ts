import type {
  CEOResult,
} from "./types";

import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

import {
  ceoPlanner,
} from "./planner";

import {
  ceoExecutor,
} from "./executor";

export class CEOAgent {

  async execute(
    request: AgentRequest
  ): Promise<
    AgentResult<CEOResult>
  > {

    const plan =
      ceoPlanner.createPlan({

        userId:
          request.userId ?? "",

        message:
          request.message,

      });

    const result =
      await ceoExecutor.execute(

        plan,

        request.userId ?? ""

      );

    return {

      success:
        result.success,

      data:
        result,

    };

  }

}

export const ceoAgent =
  new CEOAgent();
