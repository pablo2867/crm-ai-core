import {
  Permission,
  permissionEngine,
} from "./permissions";

import {
  Role,
  roleEngine,
} from "./roles";

export class AuthGuard {

  requirePermission(

    permissions: readonly string[],

    permission: Permission

  ): void {

    if (

      !permissionEngine.has(

        permissions,

        permission

      )

    ) {

      throw new Error(
        "PERMISSION_DENIED"
      );

    }

  }

  requireAnyPermission(

    permissions: readonly string[],

    required: readonly Permission[]

  ): void {

    if (

      !permissionEngine.hasAny(

        permissions,

        required

      )

    ) {

      throw new Error(
        "PERMISSION_DENIED"
      );

    }

  }

  requireRole(

    role: Role,

    allowed: readonly Role[]

  ): void {

    if (

      !allowed.includes(role)

    ) {

      throw new Error(
        "ROLE_DENIED"
      );

    }

  }

  getPermissions(

    role: Role

  ): readonly Permission[] {

    return roleEngine.getPermissions(

      role

    );

  }

}

export const authGuard =
  new AuthGuard();