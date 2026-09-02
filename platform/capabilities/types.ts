export interface CapabilityRequest {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  workflowId?: string;

  intent?: string;

  goal: string;

  lead?: Record<
    string,
    unknown
  >;

  input?: Record<
    string,
    unknown
  >;

}

export interface CapabilityResult<T = unknown> {

  success: boolean;

  message: string;

  data?: T;

}

/*
---------------------------------------
Capability Metadata
---------------------------------------
*/

export interface CapabilityMetadata {

  /**
   * Categoría funcional.
   * Ejemplo:
   * - sales
   * - executive
   * - marketing
   */
  category: string;

  /**
   * Prioridad de selección.
   * Mayor número = mayor prioridad.
   */
  priority: number;

  /**
   * Intenciones soportadas.
   */
  supportedIntents: string[];

  /**
   * Etiquetas para búsqueda.
   */
  tags: string[];

  /**
   * Módulos compatibles.
   * Opcional para mantener compatibilidad.
   */
  modules?: string[];

  /**
   * Organizaciones compatibles.
   */
  organizations?: string[];

  /**
   * Workspaces compatibles.
   */
  workspaces?: string[];

  /**
   * Tenants compatibles.
   */
  tenants?: string[];

}

/*
---------------------------------------
Capability
---------------------------------------
*/

export interface Capability {

  id: string;

  name: string;

  /**
   * Metadata opcional para mantener
   * compatibilidad con todas las
   * capabilities existentes.
   */
  metadata?: CapabilityMetadata;

  execute(
    request: CapabilityRequest
  ): Promise<CapabilityResult>;

}