import {
  skillEngine,
} from "../engine";

import {
  skillChainRegistry,
} from "./registry";

import type {
  SkillChainContext,
  SkillChainDefinition,
  SkillChainExecution,
} from "./types";

import type {
  SkillResult,
} from "../types";

export class SkillChainExecutor {

  private getChain(
    id: string
  ): SkillChainDefinition | undefined {

    return skillChainRegistry.find(

      chain =>

        chain.id === id

    );

  }

  async execute(

    chainId: string,

    context: SkillChainContext

  ): Promise<SkillChainExecution> {

    const chain =
      this.getChain(
        chainId
      );

    if (!chain) {

      return {

        success: false,

        context: {},

        results: [

          {

            success: false,

            message:
              `Skill Chain '${chainId}' no encontrada.`,

          },

        ],

      };

    }

    const results: SkillResult[] = [];

    const executionContext:
      Record<string, unknown> = {

        ...(context.input ?? {}),

      };

    for (const step of chain.steps) {

      const result =
        await skillEngine.executeSkill(

          step.skillId,

          {

            userId:
              context.userId,
            organizationId:
              context.organizationId,

            workspaceId:
              context.workspaceId,
            input:
              executionContext,

          }

        );

      results.push(
        result
      );

      if (!result.success) {

        return {

          success: false,

          context:
            executionContext,

          results,

        };

      }

      if (

        result.data &&

        typeof result.data ===
          "object"

      ) {

        Object.assign(

          executionContext,

          result.data as Record<
            string,
            unknown
          >

        );

      }

    }

    return {

      success: true,

      context:
        executionContext,

      results,

    };

  }

}

export const skillChainExecutor =
  new SkillChainExecutor();
