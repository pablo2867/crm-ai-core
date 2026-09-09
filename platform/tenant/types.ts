import type {
  Role,
} from "@/platform/auth/roles";

import type {
  Permission,
} from "@/platform/auth/permissions";

export interface TenantContext {

  organizationId: string;

  workspaceId: string;

  userId: string;

  role: Role;

  permissions: readonly Permission[];

}

export interface ResolveTenantRequest {

  userId: string;

}

export interface ResolveTenantResult {

  success: boolean;

  tenant?: TenantContext;

  error?: string;

}
