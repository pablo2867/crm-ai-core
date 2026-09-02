import {
  executiveMemoryStore,
} from "./store";

import type {
  ExecutiveMemoryRecord,
  MemorySearchOptions,
  SaveMemoryRequest,
} from "./types";

export class ExecutiveMemoryEngine {

  async save(
    request: SaveMemoryRequest
  ): Promise<ExecutiveMemoryRecord> {

    return executiveMemoryStore.save(
      request
    );

  }

  async search(
    options: MemorySearchOptions
  ): Promise<ExecutiveMemoryRecord[]> {

    return executiveMemoryStore.search(
      options
    );

  }

  async latest(
    userId: string
  ): Promise<ExecutiveMemoryRecord | null> {

    return executiveMemoryStore.latest(
      userId
    );

  }

  async clear(
    userId: string
  ): Promise<void> {

    return executiveMemoryStore.clear(
      userId
    );

  }

}

export const executiveMemoryEngine =
  new ExecutiveMemoryEngine();