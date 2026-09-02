export interface CreateTaskRequest {
  userId: string;
  leadName: string;
  title: string;
  description: string;
  priority?: string;
}

export interface CreateTaskResponse {
  success: boolean;

  // Nuevo: indica que la tarea ya existía
  skipped?: boolean;

  // Nuevo: mensaje informativo devuelto por la API
  message?: string;

  // Nuevo: id de la tarea existente cuando se omite
  taskId?: string | number;

  // Tarea creada
  task?: unknown;

  // Error en caso de fallo
  error?: string;
}

export async function createTask(
  request: CreateTaskRequest
): Promise<CreateTaskResponse> {
  const response = await fetch(
    "/api/create-task",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: request.userId,
        lead_name: request.leadName,
        title: request.title,
        description: request.description,
        priority: request.priority ?? "MEDIUM",
      }),
    }
  );

  return response.json();
}