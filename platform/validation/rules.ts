import type {
  ValidationRule,
} from "./types";

export class LeadClosedRule
  implements ValidationRule {

  id =
    "lead-closed";

  validate() {

    return {

      valid: true,

    };

  }

}

export class DuplicateWorkflowRule
  implements ValidationRule {

  id =
    "duplicate-workflow";

  validate() {

    return {

      valid: true,

    };

  }

}

export class RecentFollowupRule
  implements ValidationRule {

  id =
    "recent-followup";

  validate() {

    return {

      valid: true,

    };

  }

}

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

export class RevenueRule
  implements ValidationRule {

  id =
    "revenue";

  validate() {

    return {

      valid: true,

    };

  }

}

export class PermissionRule
  implements ValidationRule {

  id =
    "permission";

  validate() {

    return {

      valid: true,

    };

  }

}

export const validationRules: ValidationRule[] = [

  new LeadClosedRule(),

  new DuplicateWorkflowRule(),

  new RecentFollowupRule(),

  new PipelineStageRule(),

  new RevenueRule(),

  new PermissionRule(),

];