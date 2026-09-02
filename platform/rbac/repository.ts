import {
  tenantResolver,
} from "@/platform/tenant";

import type {
  UserPermissions,
} from "./types";

export class RBACRepository {

  async getUserPermissions(

    userId: string

  ): Promise<UserPermissions> {

    const result =

      await tenantResolver.resolve({

        userId,

      });

    if (

      !result.success ||

      !result.tenant

    ) {

      throw new Error(
        "TENANT_NOT_FOUND"
      );

    }

    return {

      userId,

      organizationId:

        result.tenant.organizationId,

      workspaceId:

        result.tenant.workspaceId,

      role:

        result.tenant.role as UserPermissions["role"],

      permissions:

        result.tenant.permissions as UserPermissions["permissions"],

    };

  }

}

export const rbacRepository =
  new RBACRepository();