import {
  validationRegistry,
} from "./registry";

import type {
  ValidationRequest,
  ValidationResult,
  ValidationEngineResult,
} from "./types";

export class ValidationEngine {

  async validate(

    request: ValidationRequest

  ): Promise<ValidationEngineResult> {

    const rules =
      validationRegistry.getAll();

    const results: ValidationResult[] = [];

    for (

      const rule of rules

    ) {

      const result =
        await rule.validate(
          request
        );

      results.push(
        result
      );

      if (

        !result.valid &&

        result.severity === "HIGH"

      ) {

        return {

          valid: false,

          results,

        };

      }

    }

    return {

      valid:
        results.every(

          result =>
            result.valid

        ),

      results,

    };

  }

}

export const validationEngine =
  new ValidationEngine();
