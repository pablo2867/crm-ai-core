/*
---------------------------------------
Metric Record
Modelo interno utilizado por el
AIMetricsEngine mientras ejecuta
las mediciones.
---------------------------------------
*/

export interface MetricRecord {

  /*
  ---------------------------------------
  Identificador técnico
  ---------------------------------------
  */

  id: string;

  /*
  ---------------------------------------
  Nombre legible
  ---------------------------------------
  */

  name: string;

  /*
  ---------------------------------------
  CategorÃ­a
  ---------------------------------------
  */

  category: string;

  /*
  ---------------------------------------
  Estado
  ---------------------------------------
  */

  status:
    | "running"
    | "completed"
    | "failed";

  /*
  ---------------------------------------
  Tiempos
  ---------------------------------------
  */

  startedAt: number;

  finishedAt?: number;

}

/*
---------------------------------------
Reporte enviado al Runtime,
API y Frontend.
---------------------------------------
*/

export interface MetricReport {

  id: string;

  name: string;

  category: string;

  status:
    | "running"
    | "completed"
    | "failed";

  duration: number;

}
