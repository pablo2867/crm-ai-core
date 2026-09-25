import {
  eventBus,
  Events,
} from "@/platform/events";

import {
  automationEngine,
} from "@/platform/automation";

eventBus.on(
  Events.LEAD_CREATED,
  async (event) => {

    console.log(
      "[AI CORE]",
      "Lead creado:",
      event.payload
    );

    await automationEngine.execute(
      event
    );}
);

