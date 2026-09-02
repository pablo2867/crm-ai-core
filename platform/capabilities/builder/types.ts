export interface CapabilityContext {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  workflowId?: string;

  intent?: string;

  lead?: Record<string, unknown>;

  metadata?: Record<string, unknown>;

}

export interface CapabilityContextInput {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  workflowId?: string;

  intent?: string;

  lead?: Record<string, unknown>;

  metadata?: Record<string, unknown>;

}