import {
  runtimeRepairAdapter,
} from "./runtime";

import {
  configRepairAdapter,
} from "./config";

import {
  sqlRepairAdapter,
} from "./sql";

import {
  codeRepairAdapter,
} from "./code";

import type {
  RepairAdapter,
  RepairAdapterType,
} from "./types";

export class RepairAdapterRegistry {

  private readonly adapters =
    new Map<
      RepairAdapterType,
      RepairAdapter
    >();

  register(
    adapter: RepairAdapter
  ): void {

    this.adapters.set(
      adapter.type,
      adapter
    );

  }

  get(
    type: RepairAdapterType
  ):
    RepairAdapter |
    undefined {

    return this.adapters.get(
      type
    );

  }

  getAll():
    RepairAdapter[] {

    return Array.from(
      this.adapters.values()
    );

  }

  has(
    type: RepairAdapterType
  ): boolean {

    return this.adapters.has(
      type
    );

  }

}

export const repairAdapterRegistry =
  new RepairAdapterRegistry();

repairAdapterRegistry.register(
  runtimeRepairAdapter
);

repairAdapterRegistry.register(
  configRepairAdapter
);

repairAdapterRegistry.register(
  sqlRepairAdapter
);

repairAdapterRegistry.register(
  codeRepairAdapter
);
