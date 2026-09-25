import {
  findBestLeadSkillDefinition,
} from "./find-best-lead";

import {
  createTaskSkillDefinition,
} from "./create-task";

import {
  generateFollowupSkillDefinition,
} from "./generate-followup";

import {
  salesLeadRankingSkillDefinition,
} from "./sales-lead-ranking";

import {
  dailyPrioritiesSkillDefinition,
} from "./daily-priorities";

import {
  generateEmailSkillDefinition,
} from "./generate-email";

import {
  chatResponseSkillDefinition,
} from "./chat-response";

import {
  whatsappResponseSkillDefinition,
} from "./whatsapp-response";

import type {
  SkillDefinition,
} from "./types";

export class SkillRegistry {

  private readonly skills =
    new Map<
      string,
      SkillDefinition
    >();

  constructor(
    definitions: SkillDefinition[]
  ) {

    definitions.forEach(
      definition =>
        this.register(
          definition
        )
    );

  }

  register(
    definition: SkillDefinition
  ): void {

    this.skills.set(
      definition.id,
      definition
    );

  }

  get(
    id: string
  ): SkillDefinition | undefined {

    return this.skills.get(
      id
    );

  }

  getAll(): SkillDefinition[] {

    return Array.from(
      this.skills.values()
    );

  }

  has(
    id: string
  ): boolean {

    return this.skills.has(
      id
    );

  }

  size(): number {

    return this.skills.size;

  }

}

export const skillRegistry =
  new SkillRegistry([

    findBestLeadSkillDefinition,

    createTaskSkillDefinition,

    generateFollowupSkillDefinition,

    salesLeadRankingSkillDefinition,

    dailyPrioritiesSkillDefinition,

    generateEmailSkillDefinition,

    chatResponseSkillDefinition,

    whatsappResponseSkillDefinition,

  ]);

export function getSkill(
  id: string
): SkillDefinition | undefined {

  return skillRegistry.get(
    id
  );

}

export function getAllSkills(): SkillDefinition[] {

  return skillRegistry.getAll();

}


