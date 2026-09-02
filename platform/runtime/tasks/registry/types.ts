import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "../types";

export interface RuntimeTaskHandler {

  id: string;

  execute(

    task: RuntimeTask

  ): Promise<RuntimeTaskResult>;

}