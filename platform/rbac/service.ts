import {
  rbacRepository,
} from "./repository";

import {
  Roles,
} from "./roles";

import type {
  Permission,
  UserPermissions,
} from "./types";

export class RBACService {

  async getUserPermissions(

    userId: string

  ): Promise<UserPermissions> {

    return rbacRepository.getUserPermissions(
      userId
    );

  }

  async hasPermission(

    userId: string,

    permission: Permission

  ): Promise<boolean> {

    const user =

      await this.getUserPermissions(
        userId
      );

    const definition =

      Roles[user.role];

    return definition.permissions.includes(
      permission
    );

  }

}

export const rbacService =
  new RBACService();