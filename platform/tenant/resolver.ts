import {
  membershipEngine,
} from "@/platform/membership";

import {
  organizationEngine,
} from "@/platform/organization";

import {
  workspaceEngine,
} from "@/platform/workspace";

import type {
  ResolveTenantRequest,
  ResolveTenantResult,
  TenantContext,
} from "./types";

function permissionsForRole(
  role: string
): string[] {

  switch (
    role.toLowerCase()
  ) {

    case "owner":

      return [
        "organization.read",
        "organization.write",
        "workspace.read",
        "workspace.write",
        "members.read",
        "members.write",
        "leads.read",
        "leads.write",
        "pipeline.read",
        "pipeline.write",
        "analytics.read",
        "tasks.read",
        "tasks.write",
        "ai.execute",
      ];

    case "admin":

      return [
        "organization.read",
        "workspace.read",
        "workspace.write",
        "members.read",
        "members.write",
        "leads.read",
        "leads.write",
        "pipeline.read",
        "pipeline.write",
        "analytics.read",
        "tasks.read",
        "tasks.write",
        "ai.execute",
      ];

    case "manager":

      return [
        "workspace.read",
        "leads.read",
        "leads.write",
        "pipeline.read",
        "pipeline.write",
        "analytics.read",
        "tasks.read",
        "tasks.write",
        "ai.execute",
      ];

    case "sales":

      return [
        "workspace.read",
        "leads.read",
        "leads.write",
        "pipeline.read",
        "pipeline.write",
        "tasks.read",
        "tasks.write",
        "ai.execute",
      ];

    case "member":

      return [
        "workspace.read",
        "leads.read",
        "leads.write",
        "pipeline.read",
        "tasks.read",
        "tasks.write",
        "ai.execute",
      ];

    default:

      return [
        "workspace.read",
        "leads.read",
        "pipeline.read",
        "tasks.read",
      ];

  }

}

export class TenantResolver {

  async resolve(
    request: ResolveTenantRequest,
  ): Promise<ResolveTenantResult> {

    /*
    ---------------------------------------
    Membership
    ---------------------------------------
    */

    const membership =
      await membershipEngine.get({

        userId:
          request.userId,

      });

    if (!membership) {

      return {

        success:
          false,

        error:
          "TENANT_NOT_FOUND",

      };

    }

    /*
    ---------------------------------------
    Organization
    ---------------------------------------
    */

    const organization =
      await organizationEngine.getById({

        id:
          membership.organizationId,

      });

    if (!organization) {

      return {

        success:
          false,

        error:
          "ORGANIZATION_NOT_FOUND",

      };

    }

    /*
    ---------------------------------------
    Workspace
    ---------------------------------------
    */

    const workspace =
      await workspaceEngine.getById({

        id:
          membership.workspaceId,

      });

    if (!workspace) {

      return {

        success:
          false,

        error:
          "WORKSPACE_NOT_FOUND",

      };

    }

    /*
    ---------------------------------------
    Permissions
    ---------------------------------------
    Derivadas del rol.
    organization_members no tiene
    una columna permissions.
    ---------------------------------------
    */

    const permissions =
      permissionsForRole(
        membership.role
      );

    /*
    ---------------------------------------
    Tenant Context
    ---------------------------------------
    */

    const tenant: TenantContext = {

      organizationId:
        membership.organizationId,

      workspaceId:
        membership.workspaceId,

      userId:
        membership.userId,

      role:
        membership.role,

      permissions,

    };

    return {

      success:
        true,

      tenant,

    };

  }

}

export const tenantResolver =
  new TenantResolver();
