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

    workflow:
      "business-analysis",
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

    workflow:
      "business-growth",
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

    workflow:
      "business-analysis",
  },


  /*
  ---------------------------------------
  Financial Intelligence
  ---------------------------------------
  */

  {
    id: "financial.analysis",

    keywords: [
      "analisis financiero",
      "análisis financiero",
      "analiza mis finanzas",
      "analizar mis finanzas",
      "situación financiera",
      "situacion financiera",
      "estado financiero",
      "estados financieros",

      "revenue",
      "revenue actual",
      "current revenue",

      "ingreso",
      "ingresos",
      "ingresos actuales",
      "ingreso actual",

      "ventas",
      "ventas actuales",

      "cuanto ingreso",
      "cuánto ingreso",
      "cuanto ingresa",
      "cuánto ingresa",

      "cuanto vendi",
      "cuánto vendí",
      "cuanto hemos vendido",
      "cuánto hemos vendido",

      "gastos",
      "gasto",
      "gastos actuales",
      "gasto actual",
      "mis gastos",
      "mis gastos actuales",
      "cuáles son mis gastos",
      "cuales son mis gastos",
      "cuáles son mis gastos actuales",
      "cuales son mis gastos actuales",
      "cuanto gasto",
      "cuánto gasto",

      "ingresos y gastos",
      "rentabilidad",
      "flujo de efectivo",
      "flujo de caja",
      "finanzas",
      "financiero",
      "financiera",
    ],

    confidence: 0.99,

    collaboration: true,

    workflow:
      "financial-analysis",
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


