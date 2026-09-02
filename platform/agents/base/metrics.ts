export class AgentMetrics {

  start(): number {

    return Date.now();

  }

  finish(
    startedAt: number
  ): number {

    return Date.now() - startedAt;

  }

}

export const agentMetrics =
  new AgentMetrics();