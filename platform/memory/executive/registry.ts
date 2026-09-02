import {
  executiveMemoryEngine,
} from "./engine";

import type {
  ExecutiveMemoryEngine,
} from "./engine";

export class ExecutiveMemoryRegistry {

  private readonly memories =
    new Map<string, ExecutiveMemoryEngine>();

  constructor() {

    this.register(
      "executive",
      executiveMemoryEngine
    );

  }

  register(

    name: string,

    engine: ExecutiveMemoryEngine

  ): void {

    this.memories.set(
      name,
      engine
    );

  }

  get(
    name = "executive"
  ): ExecutiveMemoryEngine {

    const memory =
      this.memories.get(name);

    if (!memory) {

      throw new Error(
        `Memory '${name}' no registrada.`
      );

    }

    return memory;

  }

  list(): string[] {

    return [
      ...this.memories.keys(),
    ];

  }

}

export const executiveMemoryRegistry =
  new ExecutiveMemoryRegistry();