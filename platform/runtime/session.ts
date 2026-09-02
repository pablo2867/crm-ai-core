import {
  RuntimeState,
} from "./state";

export class RuntimeSession {

  /*
  ---------------------------------------
  Estado compartido de toda la ejecución
  ---------------------------------------
  */

  readonly state =
    new RuntimeState();

  /*
  ---------------------------------------
  Constructor
  ---------------------------------------
  */

  constructor() {}

}

export const createRuntimeSession =
  () => new RuntimeSession();