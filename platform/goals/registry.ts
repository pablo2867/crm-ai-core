import type {
  BusinessGoal,
} from "./types";

export const goalRegistry: BusinessGoal[] = [

  {

    id: "increase_revenue",

    title: "Incrementar ingresos",

    description:
      "Aumentar los ingresos mediante acciones comerciales.",

    priority: 100,

  },

  {

    id: "improve_conversion",

    title: "Mejorar conversión",

    description:
      "Incrementar la tasa de cierre.",

    priority: 90,

  },

  {

    id: "reactivate_clients",

    title: "Reactivar clientes",

    description:
      "Recuperar clientes inactivos.",

    priority: 80,

  },

  {

    id: "grow_pipeline",

    title: "Expandir pipeline",

    description:
      "Incrementar oportunidades activas.",

    priority: 85,

  },

  {

    id: "analyze_business",

    title: "Analizar negocio",

    description:
      "Generar diagnóstico ejecutivo.",

    priority: 95,

  },

];
