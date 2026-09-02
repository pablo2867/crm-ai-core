import {
  executiveEngine,
} from "@/platform/executive";

import type {
  ExecutiveServiceResult,
} from "./types";

export class ExecutiveService {

  async get(
    userId: string
  ): Promise<ExecutiveServiceResult> {

    /*
    ---------------------------------------
    Executive Intelligence Engine
    ---------------------------------------
    */

    const report =
      await executiveEngine.execute(
        userId
      );

    return {

      success: true,

      report,

    };

  }

}

export const executiveService =
  new ExecutiveService();