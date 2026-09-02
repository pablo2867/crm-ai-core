import {
  createTask,
} from "@/platform/services/task-service";

import type {
  SkillDefinition,
  SkillRequest,
  SkillResult,
} from "../types";

interface BestLead {

  id: number;

  name: string;

}

interface CreateTaskInput {

  title?: string;

  bestLead?: BestLead;

}

export const createTaskSkillDefinition:
  SkillDefinition = {

  id:
    "create-task",

  name:
    "Create Task",

  description:
    "Creates a CRM task.",

  async execute(

    request: SkillRequest

  ): Promise<SkillResult> {

    if (!request.userId) {

      return {

        success:
          false,

        message:
          "userId requerido.",

      };

    }

    const input =
      (
        request.input ??
        {}
      ) as CreateTaskInput;

    const leadName =
      input.bestLead?.name;

    if (!leadName) {

      return {

        success:
          false,

        message:
          "No existe un lead para crear la tarea.",

      };

    }

    const task =
      await createTask({

        userId:
          request.userId,

        leadName,

        title:
          input.title ??
          `Llamar a ${leadName}`,

      });

    return {

      success:
        true,

      message:
        "Tarea creada correctamente.",

      data: {

        task,

      },

    };

  },

};

export async function createTaskSkill(

  request: SkillRequest

): Promise<SkillResult> {

  return createTaskSkillDefinition.execute(
    request
  );

}
