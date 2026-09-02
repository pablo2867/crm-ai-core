import type {
  PlatformModule,
} from "./types";

export class ModuleRegistry {

  private readonly modules =
    new Map<
      string,
      PlatformModule
    >();

  register(
    module: PlatformModule
  ): void {

    this.modules.set(
      module.id,
      module
    );

  }

  unregister(
    moduleId: string
  ): void {

    this.modules.delete(
      moduleId
    );

  }

  get(
    moduleId: string
  ): PlatformModule | undefined {

    return this.modules.get(
      moduleId
    );

  }

  getAll(): PlatformModule[] {

    return Array.from(
      this.modules.values()
    );

  }

  has(
    moduleId: string
  ): boolean {

    return this.modules.has(
      moduleId
    );

  }

  clear(): void {

    this.modules.clear();

  }

}

export const moduleRegistry =
  new ModuleRegistry();