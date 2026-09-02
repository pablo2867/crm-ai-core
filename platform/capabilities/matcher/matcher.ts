import type {
  Capability,
} from "../types";

import type {
  CapabilityMatchRequest,
} from "./types";

export function matchCapabilities(
  request: CapabilityMatchRequest
): Capability[] {

  return request.capabilities.filter(
    capability => {

      const metadata =
        capability.metadata;

      /*
      ----------------------------
      Compatibilidad hacia atrás
      ----------------------------
      */

      if (!metadata) {

        return true;

      }

      /*
      ----------------------------
      Intent
      ----------------------------
      */

      if (

        request.intent &&

        metadata.supportedIntents.length > 0 &&

        !metadata.supportedIntents.includes(
          request.intent
        )

      ) {

        return false;

      }

      return true;

    }
  );

}