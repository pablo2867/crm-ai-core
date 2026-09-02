import type {
  AgentHooks,
  BaseAgentRequest,
  BaseAgentResult,
} from "./types";

export class DefaultAgentHooks
  implements AgentHooks {

  async beforeExecute(
    _request: BaseAgentRequest
  ): Promise<void> {

    // Hook para futuras extensiones.

  }

  async afterExecute(
    _result: BaseAgentResult
  ): Promise<void> {

    // Hook para futuras extensiones.

  }

}

export const defaultAgentHooks =
  new DefaultAgentHooks();