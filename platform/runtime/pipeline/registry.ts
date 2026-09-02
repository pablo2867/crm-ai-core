import type {
  RuntimeRequest,
} from "../types";

import type {
  RuntimePipeline,
} from "./types";

import {
  buildDefaultPipeline,
} from "./definitions/default";

export class RuntimePipelineRegistry {

  resolve(
    request: RuntimeRequest
  ): RuntimePipeline {

    /*
    ---------------------------------------
    Pipeline por defecto
    ---------------------------------------
    */

    return buildDefaultPipeline(
      request
    );

  }

}

export const runtimePipelineRegistry =
  new RuntimePipelineRegistry();