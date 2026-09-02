import {
  tenantIsolationRule,
} from "./rules/tenant/isolation";

import {
  leadDataConsistencyRule,
} from "./rules/data-consistency/leads";

import {
  runtimeContextIntegrityRule,
} from "./rules/runtime/context-integrity";

import {
  workflowIntegrityRule,
} from "./rules/workflow/integrity";

import {
  skillIntegrityRule,
} from "./rules/skill/integrity";

import {
  capabilityIntegrityRule,
} from "./rules/capability/integrity";

import {
  copilotIntegrityRule,
} from "./rules/copilot/integrity";

import {
  apiRouteIntegrityRule,
} from "./rules/api/route-integrity";

import type {
  DiagnosticRegistry,
  DiagnosticRule,
} from "./types";

export class DiagnosticRuleRegistry
  implements DiagnosticRegistry {

  private readonly rules =
    new Map<
      string,
      DiagnosticRule
    >();

  register(
    rule: DiagnosticRule
  ): void {

    this.rules.set(
      rule.id,
      rule
    );

  }

  get(
    id: string
  ): DiagnosticRule | undefined {

    return this.rules.get(
      id
    );

  }

  getAll(): DiagnosticRule[] {

    return Array.from(
      this.rules.values()
    );

  }

  has(
    id: string
  ): boolean {

    return this.rules.has(
      id
    );

  }

  size(): number {

    return this.rules.size;

  }

}

export const diagnosticRegistry =
  new DiagnosticRuleRegistry();

diagnosticRegistry.register(
  tenantIsolationRule
);

diagnosticRegistry.register(
  leadDataConsistencyRule
);

diagnosticRegistry.register(
  runtimeContextIntegrityRule
);

diagnosticRegistry.register(
  workflowIntegrityRule
);

diagnosticRegistry.register(
  skillIntegrityRule
);

diagnosticRegistry.register(
  capabilityIntegrityRule
);

diagnosticRegistry.register(
  copilotIntegrityRule
);

diagnosticRegistry.register(
  apiRouteIntegrityRule
);
