import type { ExecutionSession } from "./execution-session";

export interface ExecutionContext {

  session: ExecutionSession;

  variables: Record<string, unknown>;

  state: Record<string, unknown>;

  results: Record<string, unknown>;

  metadata: Record<string, unknown>;

}