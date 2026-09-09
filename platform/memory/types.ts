export interface MemoryRecord {

  id?: string;

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  type: string;

  title: string;

  content: string;

  metadata?: Record<string, unknown>;

  createdAt?: string;

}

export interface RememberRequest {

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  type: string;

  title: string;

  content: string;

  metadata?: Record<string, unknown>;

}

export interface RecallRequest {

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  type?: string;

  limit?: number;

}

export interface MemorySummary {

  summary: string;

  records: MemoryRecord[];

}
