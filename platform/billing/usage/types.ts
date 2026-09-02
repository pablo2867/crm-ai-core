export interface AIUsageRequest {
  organizationId: string;
  userId?: string;
  workflow: string;
  skill: string;
  status?: string;
  since: Date;
}

export interface AIUsageResult {
  usage: number;
  limit?: number;
  allowed: boolean;
  reason?: string;
  plan?: string;
}
