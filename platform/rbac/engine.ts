import {
  rbacService,
} from "./service";

import type {
  Permission,
  UserPermissions,
} from "./types";

export class RBACEngine {

  async getUserPermissions(

    userId: string

  ): Promise<UserPermissions> {

    return rbacService.getUserPermissions(
      userId
    );

  }

  async hasPermission(

    userId: string,

    permission: Permission

  ): Promise<boolean> {

    return rbacService.hasPermission(
      userId,
      permission
    );

  }

  async requirePermission(

    userId: string,

    permission: Permission

  ): Promise<void> {

    const allowed =

      await this.hasPermission(

        userId,

        permission

      );

    if (!allowed) {

      throw new Error(
        "PERMISSION_DENIED"
      );

    }

  }

}

export const rbacEngine =
  new RBACEngine();