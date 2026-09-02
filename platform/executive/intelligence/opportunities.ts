import type {
  BusinessContext,
} from "@/platform/context/business";

import type {
  ExecutiveOpportunity,
} from "./types";

export class OpportunityDetector {

  detect(
    business: BusinessContext
  ): ExecutiveOpportunity[] {

    const opportunities:
      ExecutiveOpportunity[] = [];

    /*
    ---------------------------------------
    Muchos leads activos
    ---------------------------------------
    */

    if (

      business.metrics.activeLeads >= 10

    ) {

      opportunities.push({

        id:
          "many-active-leads",

        title:
          "Pipeline con alto potencial",

        description:
          "Existe un número elevado de leads activos que pueden convertirse en ventas.",

        priority: 90,

      });

    }

    /*
    ---------------------------------------
    Forecast superior al revenue
    ---------------------------------------
    */

    if (

      business.metrics.forecastRevenue >

      business.metrics.estimatedRevenue

    ) {

      opportunities.push({

        id:
          "forecast-growth",

        title:
          "Potencial de crecimiento",

        description:
          "El forecast proyecta ingresos superiores a los actuales.",

        priority: 80,

      });

    }

    /*
    ---------------------------------------
    Muchos leads abiertos
    ---------------------------------------
    */

    if (

      business.metrics.totalLeads >

      business.metrics.closedDeals

    ) {

      opportunities.push({

        id:
          "open-opportunities",

        title:
          "Oportunidades pendientes",

        description:
          "Todavía existen múltiples oportunidades por trabajar.",

        priority: 70,

      });

    }

    return opportunities;

  }

}

export const opportunityDetector =
  new OpportunityDetector();
