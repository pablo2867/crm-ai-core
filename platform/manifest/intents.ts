export interface IntentDefinition {

  id: string;

  keywords: string[];

  confidence: number;

  collaboration: boolean;

  workflow?: string;

}

export const intents: IntentDefinition[] = [


  {
    id: "sales.lead-ranking",

    keywords: [
      "probabilidad de cierre",
      "probabilidad de cerrar",
      "más probabilidad de cierre",
      "mas probabilidad de cierre",
      "mayor probabilidad",
      "mejor probabilidad",
      "mejores leads para cerrar",
      "candidatos de cierre",
      "candidatos para cerrar",
      "leads más probables",
      "leads mas probables",
    ],

    confidence: 0.99,

    collaboration: false,

    workflow:
      "sales-lead-ranking",
  },
  /*
  ---------------------------------------
  Business Intelligence
  ---------------------------------------
  */

  {
    id: "business.analysis",
    keywords: [
      "analiza mi negocio",
      "analizar negocio",
      "análisis del negocio",
      "analisis del negocio",
      "estado del negocio",
    ],
    confidence: 0.99,
    collaboration: true,
    workflow: "business-analysis",
  },

  {
    id: "business.growth",
    keywords: [
      "crecer",
      "aumentar ventas",
      "incrementar ventas",
      "growth",
      "estrategia",
    ],
    confidence: 0.98,
    collaboration: true,
    workflow: "business-growth",
  },

  {
    id: "business.health",
    keywords: [
      "salud del negocio",
      "business health",
      "estado de la empresa",
    ],
    confidence: 0.98,
    collaboration: true,
    workflow: "business-analysis",
  },

  /*
  ---------------------------------------
  Sales
  ---------------------------------------
  */

  {
    id: "sales.daily-priorities",
    keywords: [
      "prioridades",
      "prioridad",
      "hoy",
      "qué debo hacer",
      "que debo hacer",
      "daily",
      "executive brief",
      "resumen ejecutivo",
      "resumen del día",
      "resumen del dia",
    ],
    confidence: 0.98,
    collaboration: false,
  },

  {
    id: "sales.followup",
    keywords: [
      "seguimiento",
      "follow",
      "lead",
    ],
    confidence: 0.95,
    collaboration: false,
  },

  {
    id: "sales.task",
    keywords: [
      "tarea",
      "task",
    ],
    confidence: 0.95,
    collaboration: false,
  },

  /*
  ---------------------------------------
  Marketing
  ---------------------------------------
  */

  {
    id: "marketing.campaign",
    keywords: [
      "campaña",
      "campaign",
    ],
    confidence: 0.95,
    collaboration: false,
  },

  {
    id: "marketing.email",
    keywords: [
      "email",
    ],
    confidence: 0.95,
    collaboration: false,
  },

];

