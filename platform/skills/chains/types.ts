import type {
  SkillRequest,
  SkillResult,
} from "../types";

export interface SkillChainStep {

  skillId: string;

}

export interface SkillChainDefinition {

  id: string;

  name: string;

  description: string;

  steps: SkillChainStep[];

}

export interface SkillChainExecution {

  success: boolean;

  /**
   * Contexto acumulado durante la ejecución
   * de toda la cadena de Skills.
   */
  context: Record<string, unknown>;

  /**
   * Resultado individual de cada Skill.
   */
  results: SkillResult[];

}

export type SkillChainContext = SkillRequest;

