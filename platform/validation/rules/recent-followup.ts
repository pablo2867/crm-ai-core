import type {
  ValidationRule,
} from "../types";

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