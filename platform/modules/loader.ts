import type {
  PlatformModule,
} from "./types";

import {
  moduleRegistry,
} from "./registry";

export class ModuleLoader {

  load(
    module: PlatformModule
  ): void {

    if (!module.enabled) {
      return;
    }

    moduleRegistry.register(
      module
    );

  }

  loadMany(
    modules: PlatformModule[]
  ): void {

    for (const platformModule of modules) {
      this.load(platformModule);
    }

  }

}

export const moduleLoader =
  new ModuleLoader();
