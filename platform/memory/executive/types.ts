export type MemoryPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface ExecutiveMemoryRecord {

  id: string;

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  leadId?: number;

  workflow?: string;

  skill?: string;

  summary: string;

  recommendation?: string;

  priority: MemoryPriority;

  metadata?: Record<string, unknown>;

  createdAt: string;

}

export interface SaveMemoryRequest {

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  leadId?: number;

  workflow?: string;

  skill?: string;

  summary: string;

  recommendation?: string;

  priority?: MemoryPriority;

  metadata?: Record<string, unknown>;

}

export interface MemorySearchOptions {

  userId: string;

  organizationId?: string;

  workspaceId?: string;

  leadId?: number;

  workflow?: string;

  skill?: string;

  limit?: number;

}
