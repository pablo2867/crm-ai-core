import type {
  ValidationRule,
} from "../types";

export class PipelineStageRule
  implements ValidationRule {

  id =
    "pipeline-stage";

  validate() {

    return {

      valid: true,

    };

  }

}