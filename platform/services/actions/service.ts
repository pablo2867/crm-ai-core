import {
  actionExecutor,
} from "@/platform/actions";

import type {
  ActionRequest,
  ActionResult,
} from "@/platform/actions";

export class ActionService {

  async execute(
    request: ActionRequest
  ): Promise<ActionResult> {

    return await actionExecutor.execute(
      request
    );

  }

}

export const actionService =
  new ActionService();