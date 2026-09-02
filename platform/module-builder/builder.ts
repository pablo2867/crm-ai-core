import type {
  PlatformModule,
} from "@/platform/modules";

export class ModuleBuilder {

  create(
    module: PlatformModule
  ): Readonly<PlatformModule> {

    return Object.freeze({

      ...module,

      capabilities: [...module.capabilities],

      routes: [...module.routes],

      entities: [...module.entities],

      workflows: [...module.workflows],

      skills: [...module.skills],

      permissions: [...module.permissions],

    });

  }

}

export const moduleBuilder =
  new ModuleBuilder();