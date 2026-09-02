import {
  RuntimeSession,
} from "./session";

import {
  runtimeEvents,
} from "./events";

import {
  runtimeEventBridge,
} from "./bridge";

import {
  runtimeTaskQueue,
} from "./tasks";

import {
  runtimeTaskRegistry,
} from "./tasks/registry";

import {
  runtimePipelineBuilder,
} from "./pipeline";

import {
  runtimeHistoryEngine,
} from "./history";

import {
  aiMetricsEngine,
} from "@/platform/metrics";

import type {
  RuntimeRequest,
  RuntimeResult,
} from "./types";

import type {
  KernelResponse,
} from "@/platform/kernel";

import {
  ensureKernel,
} from "@/platform/kernel/ensure";

export class RuntimeEngine {

  constructor() {

    runtimeEventBridge.initialize();

  }

  async execute(
    request: RuntimeRequest
  ): Promise<RuntimeResult> {

    ensureKernel();

    const session =
      new RuntimeSession();

    aiMetricsEngine.clear();

    aiMetricsEngine.start(
      "Runtime"
    );

    runtimeEvents.emit(
      "runtime.started"
    );

    runtimeTaskQueue.clear();

    const pipeline =
      runtimePipelineBuilder.build(
        request
      );

    for (const task of pipeline) {

      runtimeTaskQueue.enqueue({

        ...task,

        session,

      });

    }

    let kernelResult:
      KernelResponse | undefined;

    let runtimeSuccess = true;

    while (
      !runtimeTaskQueue.isEmpty()
    ) {

      const task =
        runtimeTaskQueue.dequeue();

      if (!task) {
        break;
      }

      session.state.addStep(
        task.name
      );

      session.state.startStep(
        task.name
      );

      aiMetricsEngine.start(
        task.id
      );

      const result =
        await runtimeTaskRegistry.execute(
          task
        );

      aiMetricsEngine.finish(
        task.id
      );

      if (!result.success) {

        runtimeSuccess = false;

        session.state.failStep(
          task.name
        );

        aiMetricsEngine.fail(
          task.id
        );

        break;
      }

      if (
        task.id === "kernel"
      ) {

        kernelResult =
          result.output as KernelResponse;

        session.state.kernel =
          result.output;

      }

      if (
        task.id === "response"
      ) {

        session.state.response =
          result.output;

      }

      session.state.completeStep(
        task.name
      );
    }

    if (
      !kernelResult?.handled
    ) {

      runtimeSuccess = false;

    }

    runtimeEvents.emit(
      runtimeSuccess
        ? "runtime.completed"
        : "runtime.failed"
    );

    aiMetricsEngine.finish(
      "Runtime"
    );

    runtimeHistoryEngine.add({

      id:
        crypto.randomUUID(),

      createdAt:
        new Date(),

      success:
        runtimeSuccess,

      summary:
        kernelResult?.summary.text ??
        "Runtime finalizado.",

      workflow:
        kernelResult?.workflow?.workflowId,

      duration:
        aiMetricsEngine.duration(
          "Runtime"
        ),

    });

    return {

      success:
        runtimeSuccess,

      summary:
        kernelResult?.summary.text ??
        "Runtime finalizado.",

      steps:
        session.state.getSteps(),

      metrics:
        aiMetricsEngine.report(),

      output:
        kernelResult,

      decision:
        kernelResult?.decision,

      workflow:
        kernelResult?.workflow,

      plan:
        kernelResult?.plan,

      validation:
        kernelResult?.validation,

      explanation:
        kernelResult?.decision?.explanation,

    };

  }

}

export const runtimeEngine =
  new RuntimeEngine();


