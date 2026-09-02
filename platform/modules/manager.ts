import type {
  PlatformModule,
} from "./types";

import {
  moduleRegistry,
} from "./registry";

export class ModuleManager {

  register(
    module: PlatformModule
  ): void {

    moduleRegistry.register(
      module
    );

  }

  unregister(
    moduleId: string
  ): void {

    moduleRegistry.unregister(
      moduleId
    );

  }

  getModule(
    moduleId: string
  ): PlatformModule | undefined {

    return moduleRegistry.get(
      moduleId
    );

  }

  getModules(): PlatformModule[] {

    return moduleRegistry.getAll();

  }

  isRegistered(
    moduleId: string
  ): boolean {

    return moduleRegistry.has(
      moduleId
    );

  }

}

export const moduleManager =
  new ModuleManager();