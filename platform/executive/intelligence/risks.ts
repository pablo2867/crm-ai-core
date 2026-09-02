import type {
  BusinessContext,
} from "@/platform/context/business";

import type {
  ExecutiveRisk,
} from "./types";

export class RiskDetector {

  detect(
    business: BusinessContext
  ): ExecutiveRisk[] {

    const risks:
      ExecutiveRisk[] = [];

    /*
    ---------------------------------------
    Pipeline pequeño
    ---------------------------------------
    */

    if (

      business.metrics.activeLeads < 5

    ) {

      risks.push({

        id:
          "low-pipeline",

        title:
          "Pipeline reducido",

        description:
          "Hay pocos leads activos. Conviene incrementar la captación.",

        severity: 90,

      });

    }

    /*
    ---------------------------------------
    Forecast inferior al revenue esperado
    ---------------------------------------
    */

    if (

      business.metrics.forecastRevenue <

      business.metrics.estimatedRevenue

    ) {

      risks.push({

        id:
          "forecast-drop",

        title:
          "Forecast en descenso",

        description:
          "La proyección de ingresos es inferior al revenue esperado.",

        severity: 80,

      });

    }

    /*
    ---------------------------------------
    Sin cierres
    ---------------------------------------
    */

    if (

      business.metrics.closedDeals === 0

    ) {

      risks.push({

        id:
          "no-sales",

        title:
          "Sin ventas cerradas",

        description:
          "No existen negocios cerrados actualmente.",

        severity: 95,

      });

    }

    /*
    ---------------------------------------
    Baja conversión
    ---------------------------------------
    */

    const conversion =

      business.metrics.totalLeads > 0

        ? business.metrics.closedDeals /

          business.metrics.totalLeads

        : 0;

    if (

      conversion < 0.10

    ) {

      risks.push({

        id:
          "low-conversion",

        title:
          "conversión baja",

        description:
          "La tasa de conversión está por debajo del 10%.",

        severity: 85,

      });

    }

    return risks;

  }

}

export const riskDetector =
  new RiskDetector();
