import "@/platform/listeners";

import {
  moduleEngine,
} from "@/platform/module-engine";

import {
  moduleManager,
} from "@/platform/modules";

import {
  capabilityProvider,
} from "@/platform/capability-provider";

import {
  crmModule,
} from "@/modules/crm";

import {
  financialModule,
} from "@/modules/financial";

export function bootKernel(): void {

  moduleEngine.initialize([

    crmModule,

    financialModule,

  ]);

  console.log(
    "[AI CORE]",
    "Kernel iniciado"
  );

  console.log(
    "[AI CORE]",
    "Modules:",
    moduleManager
      .getModules()
      .map(
        module =>
          module.id
      )
  );

  console.log(
    "[AI CORE]",
    "Capabilities:",
    capabilityProvider
      .getAll()
      .map(
        capability =>
          capability.id
      )
  );

}
