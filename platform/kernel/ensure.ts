import {
  moduleEngine,
} from "@/platform/module-engine";

import {
  moduleManager,
} from "@/platform/modules";

import {
  crmModule,
} from "@/modules/crm";

import {
  financialModule,
} from "@/modules/financial";

let initialized = false;

export function ensureKernel(): void {

  if (
    initialized &&
    moduleManager.isRegistered("crm") &&
    moduleManager.isRegistered("financial")
  ) {
    return;
  }

  const modules = [];

  if (
    !moduleManager.isRegistered("crm")
  ) {

    modules.push(
      crmModule
    );

  }

  if (
    !moduleManager.isRegistered("financial")
  ) {

    modules.push(
      financialModule
    );

  }

  if (modules.length > 0) {

    moduleEngine.initialize(
      modules
    );

  }

  initialized = true;

}
