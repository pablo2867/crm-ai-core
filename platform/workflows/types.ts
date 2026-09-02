export interface WorkflowStep {

  id: string;

  /*
  ---------------------------------------
  Legacy Skill
  ---------------------------------------
  */

  skill?: string;

  /*
  ---------------------------------------
  Runtime Capability
  ---------------------------------------
  */

  capability?: string;

  /*
  ---------------------------------------
  Step-specific input

  This input is merged with the accumulated
  workflow context by WorkflowExecutor.
  ---------------------------------------
  */

  input?: Record<
    string,
    unknown
  >;

}

export interface WorkflowMetadata {

  enabled: boolean;

  priority: number;

  category: string;

  supportedIntents: string[];

  tags: string[];

  capabilityId?: string;

}

export interface Workflow {

  id: string;

  name: string;

  steps: WorkflowStep[];

  metadata?: WorkflowMetadata;

}

export interface WorkflowContext {

  [key: string]: unknown;

}

export interface WorkflowExecutionStep {

  skill?: string;

  capability?: string;

  success: boolean;

  message: string;

  data?: unknown;

  durationMs: number;

}

export interface WorkflowResult {

  /*
  ---------------------------------------
  Workflow Identity
  ---------------------------------------
  */

  workflowId: string;

  workflowName: string;

  /*
  ---------------------------------------
  Result
  ---------------------------------------
  */

  success: boolean;

  context: WorkflowContext;

  results: unknown[];

  execution: WorkflowExecutionStep[];

  totalDurationMs: number;

}
