import {
  storeMemory,
} from "./storage";

import {
  recallMemories,
} from "./retrieval";

import {
  summarizeMemories,
} from "./summarizer";

import type {
  RememberRequest,
  RecallRequest,
  MemorySummary,
} from "./types";

export class MemoryEngine {

  async remember(
    request: RememberRequest
  ) {

    await storeMemory(
      request
    );

  }

  async recall(
    request: RecallRequest
  ) {

    return recallMemories(
      request
    );

  }

  async summarize(
    request: RecallRequest
  ): Promise<MemorySummary> {

    const records =
      await this.recall(
        request
      );

    return {

      records,

      summary:
        summarizeMemories(
          records
        ),

    };

  }

}

export const memoryEngine =
  new MemoryEngine();