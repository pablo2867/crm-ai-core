export type DiagnosticMode =
  | "quick"
  | "full";

export type DiagnosticScope =
  | "block"
  | "module"
  | "system";

export type DiagnosticCategory =
  | "database"
  | "tenant"
  | "api"
  | "code"
  | "runtime"
  | "workflow"
  | "skill"
  | "copilot"
  | "architecture"
  | "data-consistency";

export type DiagnosticSeverity =
  | "info"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RepairRisk =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type RepairActionType =
  | "code"
  | "sql"
  | "config"
  | "runtime";

export type ValidationStatus =
  | "pending"
  | "passed"
  | "failed"
  | "skipped";

export interface Metric {

  name: string;

  value: number;

  unit: string;

  category: string;

}
export interface DiagnosticTenant {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export interface DiagnosticOptions {

  includeDatabase?: boolean;

  includeCode?: boolean;

  includeRuntime?: boolean;

  includeArchitecture?: boolean;

}

export interface DiagnosticRequest {

  scope: DiagnosticScope;

  block?: string;

  module?: string;

  mode: DiagnosticMode;

  tenant?: DiagnosticTenant;

  options?: DiagnosticOptions;

}

export interface DiagnosticEvidence {

  type:
    | "database"
    | "log"
    | "code"
    | "runtime"
    | "configuration"
    | "contract";

  source: string;

  description: string;

  value?: unknown;

}

export interface DiagnosticIssue {

  id: string;

  block: string;

  category: DiagnosticCategory;

  severity: DiagnosticSeverity;

  title: string;

  description: string;

  rootCause?: string;

  evidence: DiagnosticEvidence[];

  affectedComponents: string[];

  repairable: boolean;

  risk: RepairRisk;

}

export interface RepairAction {

  id: string;

  type: RepairActionType;

  target: string;

  description: string;

  reversible: boolean;

  validation: string[];

}

export interface RepairPlan {

  issueId: string;

  strategy: string;

  actions: RepairAction[];

  risk: RepairRisk;

  requiresApproval: boolean;

  validationSteps: string[];

  rollbackSteps: string[];

}

export interface ValidationResult {

  status: ValidationStatus;

  success: boolean;

  message: string;

  checks: string[];

  failedChecks: string[];

}

export interface DiagnosticValidation {

  status: ValidationStatus;

  results: ValidationResult[];

}

export interface DiagnosticResult {

  success: boolean;

  status:
    | "healthy"
    | "warning"
    | "critical"
    | "failed";

  startedAt: string;

  completedAt: string;

  durationMs: number;

  scope: DiagnosticScope;

  healthScore: number;

  issues: DiagnosticIssue[];

  evidence: DiagnosticEvidence[];

  repairPlans: RepairPlan[];

  validation: DiagnosticValidation;

}

export interface DiagnosticRuleContext {

  request: DiagnosticRequest;

  evidence: DiagnosticEvidence[];

}

export interface DiagnosticRule {

  id: string;

  block: string;

  category: DiagnosticCategory;

  description: string;

  check(
    context: DiagnosticRuleContext
  ): Promise<DiagnosticIssue | null> | DiagnosticIssue | null;

}

export interface DiagnosticRegistry {

  register(
    rule: DiagnosticRule
  ): void;

  get(
    id: string
  ): DiagnosticRule | undefined;

  getAll(): DiagnosticRule[];

  has(
    id: string
  ): boolean;

}

