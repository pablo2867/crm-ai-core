export interface SkillRequest {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

  input?: Record<
    string,
    unknown
  >;

}
export interface SkillResult<T = unknown> {

  success: boolean;

  message: string;

  data?: T;

  error?: string;

}

export interface SkillDefinition {

  id: string;

  name: string;

  description: string;

  execute(

    request: SkillRequest

  ): Promise<SkillResult> | SkillResult;

}


