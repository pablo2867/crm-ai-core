import type {
  RuntimeTask,
  RuntimeTaskResult,
} from "./types";

export class RuntimeTaskExecutor {

  async execute(

    task: RuntimeTask

  ): Promise<RuntimeTaskResult> {

    console.log(
      "[Runtime Task]",
      task.name
    );

    return {

      task,

      success: true,

      output:
        task.payload,

    };

  }

}

export const runtimeTaskExecutor =
  new RuntimeTaskExecutor();