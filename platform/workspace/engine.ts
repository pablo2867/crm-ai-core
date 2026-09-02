import {
  workspaceService,
} from "./service";

import type {
  CreateWorkspaceRequest,
  FindWorkspaceBySlugRequest,
  FindWorkspaceRequest,
  Workspace,
} from "./types";

export class WorkspaceEngine {

  async create(
    request: CreateWorkspaceRequest
  ): Promise<Workspace> {

    return workspaceService.create(
      request
    );

  }

  async getById(
    request: FindWorkspaceRequest
  ): Promise<Workspace | null> {

    return workspaceService.findById(
      request
    );

  }

  async getBySlug(
    request: FindWorkspaceBySlugRequest
  ): Promise<Workspace | null> {

    return workspaceService.findBySlug(
      request
    );

  }

}

export const workspaceEngine =
  new WorkspaceEngine();