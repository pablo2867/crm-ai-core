import {
  moduleManager,
} from "@/platform/modules";

import type {
  Capability,
} from "@/platform/capabilities";

export class CapabilityProvider {

  getAll(): Capability[] {

    /*
    ---------------------------------------
    Active Platform Modules
    ---------------------------------------

    Las Runtime Capabilities disponibles
    en ejecución provienen de los módulos
    activos registrados en ModuleRegistry.
    */

    const modules =
      moduleManager.getModules();

    /*
    ---------------------------------------
    Runtime Capabilities
    ---------------------------------------

    Cada módulo declara explícitamente
    las capabilities que expone al runtime.
    */

    const capabilities =
      modules
        .filter(
          module =>
            module.enabled
        )
        .flatMap(
          module =>
            module.runtimeCapabilities
        );

    /*
    ---------------------------------------
    Deduplicación
    ---------------------------------------

    Una capability puede ser compartida
    por más de un módulo.
    */

    const unique =
      new Map<
        string,
        Capability
      >();

    for (
      const capability of capabilities
    ) {

      unique.set(
        capability.id,
        capability
      );

    }

    return [
      ...unique.values(),
    ];

  }

  get(
    id: string
  ): Capability | undefined {

    return this
      .getAll()
      .find(
        capability =>
          capability.id === id
      );

  }

}

export const capabilityProvider =
  new CapabilityProvider();
