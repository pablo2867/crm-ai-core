export interface ExecutionMetadata {

  requestId?: string;

  timestamp?: string;

  source?: string;

  tenantId?: string;

  organizationId?: string;

}

export interface AgentRequest {

  /*
  ---------------------------------------
  Solicitud
  ---------------------------------------
  */

  message: string;

  intent: string;

  /*
  ---------------------------------------
  Identidad
  ---------------------------------------
  */

  userId?: string;

  leadId?: number;

  /*
  ---------------------------------------
  Multi Tenant
  ---------------------------------------
  */

  organizationId?: string;

  workspaceId?: string;

  moduleId?: string;

  /*
  ---------------------------------------
  Contexto
  ---------------------------------------
  */

  context?: Record<
    string,
    unknown
  >;

  /*
  ---------------------------------------
  Metadata
  ---------------------------------------
  */

  metadata?: ExecutionMetadata;

}

export interface AgentResult<T = unknown> {

  success: boolean;

  data: T;

  metadata?: {

    durationMs?: number;

    executedBy?: string;

    workflowId?: string;

    warnings?: string[];

  };

}