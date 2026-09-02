import {
  buildContext,
} from "./builder";

import type {
  AIContext,
} from "./types";

export class ContextEngine {

  async build(
    userId: string,
    organizationId?: string,
    workspaceId?: string
  ): Promise<AIContext> {

    return buildContext(
      userId,
      organizationId,
      workspaceId
    );

  }

}

export const contextEngine =
  new ContextEngine();
