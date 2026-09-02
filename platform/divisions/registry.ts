import type {
  DivisionDefinition,
  DivisionId,
} from "./contracts";

import {
  salesDivision,
} from "./sales";

import {
  growthDivision,
} from "./growth";

class DivisionRegistry {
  private readonly divisions = new Map<
    DivisionId,
    DivisionDefinition
  >();

  constructor() {
    this.register(salesDivision);
    this.register(growthDivision);
  }

  register(
    division: DivisionDefinition
  ) {
    this.divisions.set(
      division.id,
      division
    );
  }

  get(
    id: DivisionId
  ) {
    return this.divisions.get(id);
  }

  getAll() {
    return Array.from(
      this.divisions.values()
    );
  }

  exists(
    id: DivisionId
  ) {
    return this.divisions.has(id);
  }
}

export const divisionRegistry =
  new DivisionRegistry();
