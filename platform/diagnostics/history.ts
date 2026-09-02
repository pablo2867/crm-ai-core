import type {
  DiagnosticIssue,
  DiagnosticResult,
  RepairPlan,
  ValidationResult,
} from "./types";

import type {
  RepairExecutionResult,
} from "./repair-executor";

import type {
  RollbackResult,
} from "./rollback";

export interface DiagnosticHistoryRecord {

  id: string;

  createdAt: string;

  scope: DiagnosticResult["scope"];

  block?: string;

  module?: string;

  status: DiagnosticResult["status"];

  healthScore: number;

  issues: DiagnosticIssue[];

  repairPlans: RepairPlan[];

  repairs: RepairExecutionResult[];

  validation: ValidationResult[];

  rollback?: RollbackResult;

  durationMs: number;

}

export class DiagnosticHistory {

  private readonly records:
    DiagnosticHistoryRecord[] = [];

  add(
    record: DiagnosticHistoryRecord
  ): void {

    this.records.push(
      record
    );

  }

  getAll():
    DiagnosticHistoryRecord[] {

    return [
      ...this.records,
    ];

  }

  getById(
    id: string
  ):
    DiagnosticHistoryRecord |
    undefined {

    return this.records.find(
      record =>
        record.id === id
    );

  }

  getLatest(
    limit = 10
  ):
    DiagnosticHistoryRecord[] {

    return [
      ...this.records,
    ]
      .sort(
        (a, b) =>
          b.createdAt.localeCompare(
            a.createdAt
          )
      )
      .slice(
        0,
        limit
      );

  }

  count(): number {

    return this.records.length;

  }

  clear(): void {

    this.records.length = 0;

  }

}

export const diagnosticHistory =
  new DiagnosticHistory();
