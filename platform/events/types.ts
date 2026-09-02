export type AIEventStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface AIEvent<T = unknown> {

  /**
   * Identificador único del evento.
   */
  id: string;

  /**
   * Tipo del evento.
   * Ej:
   * decision.started
   * workflow.completed
   */
  type: string;

  /**
   * Componente que emitió el evento.
   */
  source: string;

  /**
   * Estado del evento.
   */
  status: AIEventStatus;

  /**
   * Timestamp ISO.
   */
  timestamp: string;

  /**
   * Duración en ms.
   */
  durationMs?: number;

  /**
   * Datos asociados.
   */
  payload?: T;

  /**
   * Metadatos opcionales.
   */
  metadata?: Record<string, unknown>;

}

export type EventHandler<T = unknown> = (

  event: AIEvent<T>

) => void;
