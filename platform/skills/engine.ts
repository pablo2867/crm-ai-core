import {
  skillRegistry,
} from "./registry";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "./types";

import {
  registerSkillSuccess,
  registerSkillError,
} from "./metrics";

export class SkillEngine {

  getSkills():
    SkillDefinition[] {

    return skillRegistry.getAll();

  }

  getSkill(
    id: string
  ):
    SkillDefinition | undefined {

    return skillRegistry.get(id);

  }

  hasSkill(
    id: string
  ):
    boolean {

    return skillRegistry.has(id);

  }

  async executeSkill(

    id: string,

    request: SkillRequest

  ): Promise<SkillResult> {

    const skill =
      this.getSkill(id);

    if (!skill) {

      return {

        success:
          false,

        message:
          `Skill '${id}' no existe.`,

        error:
          "SKILL_NOT_FOUND",

      };

    }

    try {

      const result =
        await skill.execute(
          request
        );

      registerSkillSuccess(
        id
      );

      return result;

    }

    catch (error) {

      registerSkillError(
        id
      );

      return {

        success:
          false,

        message:
          error instanceof Error
            ? error.message
            : "Error ejecutando Skill.",

        error:
          "SKILL_EXECUTION_ERROR",

      };

    }

  }

}

export const skillEngine =
  new SkillEngine();
