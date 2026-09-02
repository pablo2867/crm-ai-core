import {
  memoryEngine,
} from "@/platform/memory";

export interface SalesMemory {

  history: string[];

}

export class SalesAgentMemory {

  private memory: SalesMemory = {

    history: [],

  };

  async add(

    userId: string,

    message: string

  ) {

    /*
    ---------------------------------------
    Compatibilidad local
    ---------------------------------------
    */

    this.memory.history.push(
      message
    );

    /*
    ---------------------------------------
    Memory Engine
    ---------------------------------------
    */

    try {

      await memoryEngine.remember({

        userId,

        type:
          "sales-agent",

        title:
          "Sales Agent Message",

        content:
          message,

        metadata: {

          module:
            "sales-agent",

        },

      });

    } catch (error) {

      console.error(

        "SALES MEMORY ERROR:",

        error

      );

    }

  }

  getHistory() {

    return this.memory.history;

  }

  clear() {

    this.memory.history = [];

  }

}

export const salesMemory =
  new SalesAgentMemory();