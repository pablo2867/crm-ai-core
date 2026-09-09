import {
  membershipEngine,
} from "@/platform/membership";

import {
  organizationEngine,
} from "@/platform/organization";

import {
  workspaceEngine,
} from "@/platform/workspace";

import {
  Roles,
} from "@/platform/rbac/roles";

import type {
  Role,
} from "@/platform/auth/roles";

import type {
  Permission,
} from "@/platform/auth/permissions";

import type {
  ResolveTenantRequest,
  ResolveTenantResult,
  TenantContext,
} from "./types";

export class TenantResolver {

  async resolve(
    request: ResolveTenantRequest,
  ): Promise<ResolveTenantResult> {

    const membership =
      await membershipEngine.get({
        userId: request.userId,
      });

    if (!membership) {
      return {
        success: false,
        error: "TENANT_NOT_FOUND",
      };
    }

    const organization =
      await organizationEngine.getById({
        id: membership.organizationId,
      });

    if (!organization) {
      return {
        success: false,
        error: "ORGANIZATION_NOT_FOUND",
      };
    }

    const workspace =
      await workspaceEngine.getById({
        id: membership.workspaceId,
      });

    if (!workspace) {
      return {
        success: false,
        error: "WORKSPACE_NOT_FOUND",
      };
    }

    const role =
      membership.role as Role;

    const roleDefinition =
      Roles[role];

    if (!roleDefinition) {
      return {
        success: false,
        error: "INVALID_ROLE",
      };
    }

    const permissions:
      readonly Permission[] =
        roleDefinition.permissions;

    const tenant: TenantContext = {

      organizationId:
        membership.organizationId,

      workspaceId:
        membership.workspaceId,

      userId:
        membership.userId,

      role,

      permissions,

    };

    return {
      success: true,
      tenant,
    };
  }
}

export const tenantResolver =
  new TenantResolver();
