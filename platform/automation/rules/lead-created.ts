import {
  Events,
  AIEvent,
} from "@/platform/events";

import {
  AutomationRule,
} from "../types";

import {
  skillEngine,
} from "@/platform/skills";

export interface LeadPayload {

  id: number;

  name: string;

  user_id: string;

  ai_temperature: string;

}

export const leadCreatedRule: AutomationRule<LeadPayload> = {

  id: "hot-lead-task",

  name: "Crear tarea para Lead HOT",

  enabled: true,

  event: Events.LEAD_CREATED,

  condition(
    event: AIEvent<LeadPayload>
  ) {

    return (
      event.payload?.ai_temperature ===
      "HOT"
    );

  },

  async action(
    event: AIEvent<LeadPayload>
  ) {

    if (!event.payload) {

      return;

    }

    await skillEngine.executeSkill(

      "create-task",

      {

        userId:
          event.payload.user_id,

        input: {

          bestLead: {

            id:
              event.payload.id,

            name:
              event.payload.name,

          },

          title:
            `Llamar a ${event.payload.name}`,

        },

      }

    );

    console.log(

      "[AUTOMATION]",

      "Task creada para",

      event.payload.name

    );

  },

};