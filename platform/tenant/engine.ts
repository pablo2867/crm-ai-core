import {
  tenantResolver,
} from "./resolver";

import type {
  TenantContext,
} from "./types";

export class TenantEngine {

  async getTenant(
    userId: string,
  ): Promise<TenantContext> {

    const result =
      await tenantResolver.resolve({

        userId,

      });

    if (

      !result.success ||

      !result.tenant

    ) {

      throw new Error(
        result.error ??
        "TENANT_NOT_FOUND",
      );

    }

    return result.tenant;

  }

  clear(
    _userId?: string,
  ) {

    /*
    TenantEngine no mantiene cache.
    Este método se conserva por compatibilidad
    con llamadas existentes.
    */

    return;

  }

}

export const tenantEngine =
  new TenantEngine();
