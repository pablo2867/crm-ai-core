export interface NextBestActionRequest {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  lead: {

    id?: number;

    name?: string;

    company?: string;

    aiScore?: number;

    probability?: number;

    estimatedRevenue?: number;

    pipelineStage?: string;

    temperature?: string;

    lastActivityAt?: string;

  };

  metadata?: Record<
    string,
    unknown
  >;

}

export interface NextBestAction {

  id: string;

  title: string;

  description: string;

  priority: number;

  confidence: number;

  capabilityId?: string;

  workflowId?: string;

}

export interface NextBestActionResult {

  success: boolean;

  recommendation: NextBestAction;

  alternatives: NextBestAction[];

  explanation: string;

}