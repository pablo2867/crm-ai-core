import type {
  ValidationResult,
} from "./types";

export interface ValidationCheck {

  id: string;

  description: string;

  run:
    () =>
      Promise<boolean> |
      boolean;

}

export class DiagnosticValidator {

  async validate(
    checks: ValidationCheck[]
  ): Promise<ValidationResult> {

    const passed: string[] = [];

    const failed: string[] = [];

    for (const check of checks) {

      try {

        const success =
          await check.run();

        if (success) {

          passed.push(
            check.id
          );

        } else {

          failed.push(
            check.id
          );

        }

      } catch {

        failed.push(
          check.id
        );

      }

    }

    const success =
      failed.length === 0;

    return {

      status:
        success
          ? "passed"
          : "failed",

      success,

      message:
        success
          ? "Todas las validaciones fueron superadas."
          : `${failed.length} validación(es) fallaron.`,

      checks:
        passed,

      failedChecks:
        failed,

    };

  }

  async validateSingle(
    check: ValidationCheck
  ): Promise<ValidationResult> {

    return this.validate([
      check,
    ]);

  }

}

export const diagnosticValidator =
  new DiagnosticValidator();
