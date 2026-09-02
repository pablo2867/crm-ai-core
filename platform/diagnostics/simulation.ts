import type {
  DiagnosticIssue,
} from "./types";

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

export interface DiagnosticSimulationResult {

  issue: DiagnosticIssue;

  classification:
    ReturnType<
      typeof diagnosticIssueClassifier.classify
    >;

  rootCause:
    ReturnType<
      typeof rootCauseAnalyzer.analyze
    >;

  repairPlan:
    ReturnType<
      typeof repairPlanner.createPlan
    >;

  policy:
    ReturnType<
      typeof repairPolicy.evaluate
    >;

  repair:
    Awaited<
      ReturnType<
        typeof repairExecutor.execute
      >
    >;

  validation:
    Awaited<
      ReturnType<
        typeof diagnosticValidator.validateSingle
      >
    >;

  rollback:
    Awaited<
      ReturnType<
        typeof rollbackManager.prepare
      >
    >;

}

export class DiagnosticSimulation {

  async run():
    Promise<DiagnosticSimulationResult> {

    /*
    ---------------------------------------
    Synthetic Issue
    ---------------------------------------
    */

    const issue:
      DiagnosticIssue = {

      id:
        "simulation.low-risk.config",

      block:
        "simulation",

      category:
        "code",

      severity:
        "low",

      title:
        "Configuración sintética incorrecta",

      description:
        "Problema controlado creado únicamente para validar el ciclo Self-Healing.",

      rootCause:
        "Configuración sintética fuera del valor esperado.",

      evidence: [

        {

          type:
            "configuration",

          source:
            "simulation",

          description:
            "Evidencia sintética.",

          value:
            {
              simulated:
                true,
            },

        },

      ],

      affectedComponents: [
        "simulation",
      ],

      repairable:
        true,

      risk:
        "low",

    };

    /*
    ---------------------------------------
    Classification
    ---------------------------------------
    */

    const classification =
      diagnosticIssueClassifier.classify(
        issue
      );

    /*
    ---------------------------------------
    Root Cause
    ---------------------------------------
    */

    const rootCause =
      rootCauseAnalyzer.analyze(
        issue
      );

    /*
    ---------------------------------------
    Repair Plan
    ---------------------------------------
    */

    const repairPlan =
      repairPlanner.createPlan(
        issue,
        rootCause
      );

    /*
    ---------------------------------------
    Policy
    ---------------------------------------
    */

    const policy =
      repairPolicy.evaluate(
        issue,
        repairPlan
      );

    /*
    ---------------------------------------
    Repair
    ---------------------------------------
    */

    const repair =
      await repairExecutor.execute(
        issue,
        repairPlan,
        {
          userId:
            "simulation-user",

          organizationId:
            "simulation-organization",

          workspaceId:
            "simulation-workspace",
        }
      );

    /*
    ---------------------------------------
    Validation
    ---------------------------------------
    */

    const validation =
      await diagnosticValidator.validateSingle({

        id:
          "simulation.validation",

        description:
          "Validación controlada del escenario sintético.",

        run:
          async () =>
            repair.status ===
            "skipped",

      });

    /*
    ---------------------------------------
    Rollback Preparation
    ---------------------------------------
    */

    const rollback =
      await rollbackManager.prepare(
        repairPlan.actions
      );

    return {

      issue,

      classification,

      rootCause,

      repairPlan,

      policy,

      repair,

      validation,

      rollback,

    };

  }

}

export const diagnosticSimulation =
  new DiagnosticSimulation();

