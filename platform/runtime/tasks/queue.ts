import type {
  RuntimeTask,
} from "./types";

export class RuntimeTaskQueue {

  private tasks: RuntimeTask[] = [];

  enqueue(
    task: RuntimeTask
  ) {

    this.tasks.push(task);

  }

  dequeue() {

    return this.tasks.shift();

  }

  isEmpty() {

    return this.tasks.length === 0;

  }

  clear() {

    this.tasks = [];

  }

  getTasks() {

    return [...this.tasks];

  }

}

export const runtimeTaskQueue =
  new RuntimeTaskQueue();