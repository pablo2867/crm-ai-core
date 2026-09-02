import type {
  AgentRequest,
  AgentResult,
} from "@/platform/agents/contracts";

export interface Agent {
  execute(
    request: AgentRequest
  ): Promise<AgentResult>;
}

export interface AgentCapability {
  id: string;
  description: string;
}

export interface AgentMetadata {
  /**
   * Descripción del agente
   */
  description?: string;

  /**
   * Versión del agente
   */
  version?: string;

  /**
   * Categoría funcional
   * Ejemplo:
   * sales, marketing, finance, support...
   */
  category?: string;

  /**
   * Prioridad utilizada por el Decision Engine
   */
  priority?: number;

  /**
   * Etiquetas para clasificación
   */
  tags?: string[];

  /**
   * Capacidades que ofrece el agente
   */
  capabilities?: AgentCapability[];

  /**
   * Indica si el agente está habilitado
   */
  enabled?: boolean;
}

export interface AgentDefinition {
  /**
   * Identificador único
   */
  id: string;

  /**
   * Nombre visible
   */
  name: string;

  /**
   * Intenciones que puede manejar
   */
  intents: string[];

  /**
   * Implementación del agente
   */
  agent: Agent;

  /**
   * Información adicional.
   *
   * Es opcional para no romper
   * compatibilidad con los agentes actuales.
   */
  metadata?: AgentMetadata;
}