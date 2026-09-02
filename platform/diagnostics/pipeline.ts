import {
  diagnosticOrchestrator,
} from "./orchestrator";

import {
  diagnosticIssueClassifier,
} from "./classifier";

import {
  rootCauseAnalyzer,
} from "./root-cause";

import {
  repairPlanner,
} from "./repair-planner";

import {
  repairPolicy,
} from "./repair-policy";

import {
  repairExecutor,
} from "./repair-executor";

import {
  diagnosticValidator,
} from "./validator";

import {
  rollbackManager,
} from "./rollback";

import {
  diagnosticHistory,
} from "./history";

import type {
  DiagnosticRequest,
  DiagnosticResult,
  RepairPlan,
  ValidationResult,
} from "./types";

export interface DiagnosticPipelineResult {

  diagnostic: DiagnosticResult;

  classifications: ReturnType<
    typeof diagnosticIssueClassifier.classifyAll
  >;

  rootCauses: ReturnType<
    typeof rootCauseAnalyzer.analyzeAll
  >;

  repairPlans: RepairPlan[];

  policy: Array<{
    issueId: string;
    decision:
      | "allow"
      | "require-approval"
      | "deny";
    allowed: boolean;
    requiresApproval: boolean;
    reason: string;
  }>;

  repairs: Awaited<
    ReturnType<
      typeof repairExecutor.executeAll
    >
  >;

  validations: ValidationResult[];

}

export class DiagnosticPipeline {

  async run(
    request: DiagnosticRequest
  ): Promise<DiagnosticPipelineResult> {

    /*
    ---------------------------------------
    1. DIAGNOSTIC
    ---------------------------------------
    */

    const diagnostic =
      await diagnosticOrchestrator.run(
        request
      );

    /*
    ---------------------------------------
    2. CLASSIFICATION
    ---------------------------------------
    */

    const classifications =
      diagnosticIssueClassifier.classifyAll(
        diagnostic.issues
      );

    /*
    ---------------------------------------
    3. ROOT CAUSE
    ---------------------------------------
    */

    const rootCauses =
      rootCauseAnalyzer.analyzeAll(
        diagnostic.issues
      );

    /*
    ---------------------------------------
    4. REPAIR PLANS
    ---------------------------------------
    */

    const repairPlans =
      repairPlanner.createPlans(
        diagnostic.issues,
        rootCauses
      );

    /*
    ---------------------------------------
    5. POLICY
    ---------------------------------------
    */

    const policy =
      diagnostic.issues.map(
        issue => {

          const plan =
            repairPlans.find(
              candidate =>
                candidate.issueId ===
                issue.id
            );

          if (!plan) {

            return {

              issueId:
                issue.id,

              decision:
                issue.repairable
                  ? "deny" as const
                  : "deny" as const,

              allowed:
                false,

              requiresApproval:
                false,

              reason:
                "No existe un RepairPlan ejecutable para este issue.",

            };

          }

          return {

            issueId:
              issue.id,

            ...repairPolicy.evaluate(
              issue,
              plan
            ),

          };

        }
      );

    /*
    ---------------------------------------
    6. REPAIR
    ---------------------------------------

    El Executor sigue en modo seguro.
    Por tanto, esta fase NO modifica
    archivos, SQL, configuración ni runtime.
    ---------------------------------------
    */

    const executableItems =
      diagnostic.issues
        .map(
          issue => {

            const plan =
              repairPlans.find(
                candidate =>
                  candidate.issueId ===
                  issue.id
              );

            const decision =
              policy.find(
                item =>
                  item.issueId ===
                  issue.id
              );

            if (
              !plan ||
              !decision ||
              !decision.allowed
            ) {

              return null;

            }

            return {

              issue,
              plan,

            };

          }
        )
        .filter(
          (
            item
          ): item is {
            issue: typeof diagnostic.issues[number];
            plan: RepairPlan;
          } =>
            item !== null
        );

    const repairs =
      await repairExecutor.executeAll(
        executableItems,
        {
          userId:
            request.tenant?.userId,

          organizationId:
            request.tenant?.organizationId,

          workspaceId:
            request.tenant?.workspaceId,
        }
      );

    /*
    ---------------------------------------
    7. VALIDATION
    ---------------------------------------
    */

    const validations:
      ValidationResult[] = [];

    for (const repair of repairs) {

      if (!repair.success) {

        continue;

      }

      const validation =
        await diagnosticValidator.validateSingle({

          id:
            `${repair.issueId}.validation`,

          description:
            "Validar resultado de la reparación.",

          run:
            async () => true,

        });

      validations.push(
        validation
      );

    }

    /*
    ---------------------------------------
    8. ROLLBACK PREPARATION
    ---------------------------------------
    */

    const failedRepairs =
      repairs.filter(
        repair =>
          repair.status ===
          "executed" &&
          !repair.success
      );

    for (const repair of failedRepairs) {

      const plan =
        repairPlans.find(
          candidate =>
            candidate.issueId ===
            repair.issueId
        );

      if (plan) {

        await rollbackManager.prepare(
          plan.actions
        );

      }

    }

    /*
    ---------------------------------------
    9. HISTORY
    ---------------------------------------
    */

    diagnosticHistory.add({

      id:
        crypto.randomUUID(),

      createdAt:
        diagnostic.completedAt,

      scope:
        diagnostic.scope,

      block:
        request.block,

      module:
        request.module,

      status:
        diagnostic.status,

      healthScore:
        diagnostic.healthScore,

      issues:
        diagnostic.issues,

      repairPlans,

      repairs,

      validation:
        validations,

      durationMs:
        diagnostic.durationMs,

    });

    return {

      diagnostic,

      classifications,

      rootCauses,

      repairPlans,

      policy,

      repairs,

      validations,

    };

  }

}

export const diagnosticPipeline =
  new DiagnosticPipeline();

