export interface MemoryRecord {

  id?: number;

  userId: string;

  type: string;

  title: string;

  content: string;

  metadata?: Record<string, unknown>;

  createdAt?: string;

}

export interface RememberRequest {

  userId: string;

  type: string;

  title: string;

  content: string;

  metadata?: Record<string, unknown>;

}

export interface RecallRequest {

  userId: string;

  type?: string;

  limit?: number;

}

export interface MemorySummary {

  summary: string;

  records: MemoryRecord[];

}