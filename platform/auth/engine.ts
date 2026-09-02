import {
  authService,
} from "./service";

import {
  authGuard,
} from "./guards";

import {
  tenantEngine,
} from "@/platform/tenant";

import {
  Role,
} from "./roles";

import type {
  Permission,
} from "./permissions";

export class AuthEngine {

  /*
  ---------------------------------------
  Usuario autenticado
  ---------------------------------------
  */

  async getUser() {

    const {
      data,
      error,
    } = await authService.getUser();

    if (error || !data.user) {

      throw new Error(
        "UNAUTHORIZED"
      );

    }

    return data.user;

  }

  /*
  ---------------------------------------
  Sesión activa
  ---------------------------------------
  */

  async getSession() {

    return authService.getSession();

  }

  /*
  ---------------------------------------
  Tenant actual
  ---------------------------------------
  */

  async getTenant() {

    const user =
      await this.getUser();

    return tenantEngine.getTenant(
      user.id
    );

  }

  /*
  ---------------------------------------
  Rol actual
  ---------------------------------------
  */

  async getRole(): Promise<Role> {

    const tenant =
      await this.getTenant();

    return tenant.role as Role;

  }

  /*
  ---------------------------------------
  Permisos actuales
  ---------------------------------------
  */

  async getPermissions(): Promise<
    readonly string[]
  > {

    const tenant =
      await this.getTenant();

    return tenant.permissions;

  }

  /*
  ---------------------------------------
  Validación de Rol
  ---------------------------------------
  */

  async requireRole(

    allowed: readonly Role[]

  ): Promise<void> {

    const role =
      await this.getRole();

    authGuard.requireRole(
      role,
      allowed
    );

  }

  /*
  ---------------------------------------
  Validación de Permiso
  ---------------------------------------
  */

  async requirePermission(

    permission: Permission

  ): Promise<void> {

    const permissions =
      await this.getPermissions();

    authGuard.requirePermission(
      permissions,
      permission
    );

  }

}

export const authEngine =
  new AuthEngine();