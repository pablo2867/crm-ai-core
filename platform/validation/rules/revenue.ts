import type {
  ValidationRule,
} from "../types";

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