interface CreateTaskInput {
  userId: string;
  leadName: string;
  title: string;
  description?: string;
}

interface CreateTaskResponse {
  success: boolean;
  skipped?: boolean;
  message?: string;
  taskId?: string | number;
  task?: unknown;
  error?: string;
}

export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResponse> {
  const response = await fetch("/api/create-task", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      user_id: input.userId,
      lead_name: input.leadName,
      title: input.title,
      description: input.description ?? "",
      priority: "MEDIUM",
    }),
  });

  return response.json();
}
