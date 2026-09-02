import type {
  RuntimeRequest,
} from "../types";

import type {
  RuntimePipeline,
} from "./types";

import {
  runtimePipelineRegistry,
} from "./registry";

export class RuntimePipelineBuilder {

  build(
    request: RuntimeRequest
  ): RuntimePipeline {

    return runtimePipelineRegistry.resolve(
      request
    );

  }

}

export const runtimePipelineBuilder =
  new RuntimePipelineBuilder();