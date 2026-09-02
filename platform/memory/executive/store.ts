import type {
  ExecutiveMemoryRecord,
  MemorySearchOptions,
  SaveMemoryRequest,
} from "./types";

export class ExecutiveMemoryStore {

  private readonly records: ExecutiveMemoryRecord[] = [];

  async save(
    request: SaveMemoryRequest
  ): Promise<ExecutiveMemoryRecord> {

    const record: ExecutiveMemoryRecord = {

      id: crypto.randomUUID(),

      userId:
        request.userId,

      leadId:
        request.leadId,

      workflow:
        request.workflow,

      skill:
        request.skill,

      summary:
        request.summary,

      recommendation:
        request.recommendation,

      priority:
        request.priority ??
        "MEDIUM",

      metadata:
        request.metadata,

      createdAt:
        new Date().toISOString(),

    };

    this.records.unshift(
      record
    );

    return record;

  }

  async search(
    options: MemorySearchOptions
  ): Promise<ExecutiveMemoryRecord[]> {

    let results =
      this.records.filter(
        record =>
          record.userId ===
          options.userId
      );

    if (
      options.leadId !==
      undefined
    ) {

      results =
        results.filter(
          record =>
            record.leadId ===
            options.leadId
        );

    }

    if (
      options.workflow
    ) {

      results =
        results.filter(
          record =>
            record.workflow ===
            options.workflow
        );

    }

    if (
      options.skill
    ) {

      results =
        results.filter(
          record =>
            record.skill ===
            options.skill
        );

    }

    return results.slice(
      0,
      options.limit ?? 20
    );

  }

  async latest(
    userId: string
  ): Promise<
    ExecutiveMemoryRecord | null
  > {

    return (
      this.records.find(
        record =>
          record.userId ===
          userId
      ) ?? null
    );

  }

  async clear(
    userId: string
  ): Promise<void> {

    const remaining =
      this.records.filter(
        record =>
          record.userId !==
          userId
      );

    this.records.length = 0;

    this.records.push(
      ...remaining
    );

  }

}

export const executiveMemoryStore =
  new ExecutiveMemoryStore();