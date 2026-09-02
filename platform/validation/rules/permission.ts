import type {
  ValidationRule,
} from "../types";

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