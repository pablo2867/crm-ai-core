export interface Workspace {

  id: string;

  organizationId: string;

  name: string;

  slug: string;

  createdAt: Date;

  updatedAt: Date;

}

export interface WorkspaceMember {

  workspaceId: string;

  userId: string;

  role: string;

  active: boolean;

}

export interface WorkspaceContext {

  workspace: Workspace;

  member: WorkspaceMember;

}

export interface CreateWorkspaceRequest {

  organizationId: string;

  name: string;

}

export interface FindWorkspaceRequest {

  id: string;

}

export interface FindWorkspaceBySlugRequest {

  organizationId: string;

  slug: string;

}