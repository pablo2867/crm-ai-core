import type {
  ExecutiveOpportunity,
  ExecutiveRecommendation,
  ExecutiveRisk,
} from "./intelligence";

import type {
  HealthResult,
} from "./health/engine";

import type {
  ExecutiveKPI,
} from "./kpi/engine";

export interface ExecutiveIntelligence {

  opportunities:
    ExecutiveOpportunity[];

  risks:
    ExecutiveRisk[];

  recommendations:
    ExecutiveRecommendation[];

}

export interface ExecutiveSummary {

  /*
  ---------------------------------------
  Resumen Ejecutivo
  ---------------------------------------
  */

  overview: string;

  priorities: string[];

  risks: string[];

  opportunities: string[];

  actions: string[];

  /*
  ---------------------------------------
  Salud del negocio
  ---------------------------------------
  */

  health: HealthResult;

  /*
  ---------------------------------------
  Executive KPI
  ---------------------------------------
  */

  kpis: ExecutiveKPI;

  /*
  ---------------------------------------
  Executive Intelligence
  ---------------------------------------
  */

  intelligence: ExecutiveIntelligence;

}