import {
  moduleLoader,
} from "../modules";

import type {
  PlatformModule,
} from "../modules";

export class ModuleEngine {

  initialize(
    modules: PlatformModule[]
  ): void {

    moduleLoader.loadMany(
      modules
    );

  }

  initializeModule(
    module: PlatformModule
  ): void {

    moduleLoader.load(
      module
    );

  }

}
export const moduleEngine =
  new ModuleEngine();