import {
  moduleEngine,
} from "@/platform/module-engine";

import {
  moduleManager,
} from "@/platform/modules";

import {
  crmModule,
} from "@/modules/crm";

let initialized = false;

export function ensureKernel(): void {

  if (
    initialized &&
    moduleManager.isRegistered("crm")
  ) {
    return;
  }

  if (
    !moduleManager.isRegistered("crm")
  ) {

    moduleEngine.initialize([
      crmModule,
    ]);

  }

  initialized = true;

}
