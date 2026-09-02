export class AgentLogger {

  info(
    message: string,
    metadata?: Record<string, unknown>
  ): void {

    console.log(
      `[Agent] ${message}`,
      metadata ?? {}
    );

  }

  error(
    message: string,
    error?: unknown
  ): void {

    console.error(
      `[Agent] ${message}`,
      error
    );

  }

}

export const agentLogger =
  new AgentLogger();