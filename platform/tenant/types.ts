export interface TenantContext {

  organizationId: string;

  workspaceId: string;

  userId: string;

  role: string;

  permissions: string[];

}

export interface ResolveTenantRequest {

  userId: string;

}

export interface ResolveTenantResult {

  success: boolean;

  tenant?: TenantContext;

  error?: string;

}