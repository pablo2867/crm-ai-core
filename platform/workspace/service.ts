import {
  workspaceRepository,
} from "./repository";

import type {
  CreateWorkspaceRequest,
  FindWorkspaceBySlugRequest,
  FindWorkspaceRequest,
  Workspace,
} from "./types";

export class WorkspaceService {

  async create(
    request: CreateWorkspaceRequest
  ): Promise<Workspace> {

    return workspaceRepository.create(
      request
    );

  }

  async findById(
    request: FindWorkspaceRequest
  ): Promise<Workspace | null> {

    return workspaceRepository.findById(
      request
    );

  }

  async findBySlug(
    request: FindWorkspaceBySlugRequest
  ): Promise<Workspace | null> {

    return workspaceRepository.findBySlug(
      request
    );

  }

}

export const workspaceService =
  new WorkspaceService();