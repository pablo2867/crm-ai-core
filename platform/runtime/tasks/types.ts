import type {
  RuntimeSession,
} from "../session";

export interface RuntimeTask {

  id: string;

  name: string;

  /*
  ---------------------------------------
  Datos propios de la tarea
  ---------------------------------------
  */

  payload?: Record<
    string,
    unknown
  >;

  /*
  ---------------------------------------
  Sesión compartida del Runtime
  ---------------------------------------
  */

  session?: RuntimeSession;

}

export interface RuntimeTaskResult {

  task: RuntimeTask;

  success: boolean;

  output?: unknown;

}
