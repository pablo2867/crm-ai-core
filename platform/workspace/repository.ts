import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  CreateWorkspaceRequest,
  FindWorkspaceBySlugRequest,
  FindWorkspaceRequest,
  Workspace,
} from "./types";

export class WorkspaceRepository {

  async create(
    request: CreateWorkspaceRequest
  ): Promise<Workspace> {

    const { data, error } =
      await supabaseAdmin
        .from("workspaces")
        .insert({
          organization_id: request.organizationId,
          name: request.name,
          active: true,
        })
        .select()
        .single();

    if (error || !data) {

      throw new Error(
        error?.message ??
        "WORKSPACE_CREATE_FAILED"
      );

    }

    return {

      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      slug: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

  async findById(
    request: FindWorkspaceRequest
  ): Promise<Workspace | null> {

    const { data, error } =
      await supabaseAdmin
        .from("workspaces")
        .select("*")
        .eq("id", request.id)
        .single();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      slug: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

  async findBySlug(
    request: FindWorkspaceBySlugRequest
  ): Promise<Workspace | null> {

    const { data, error } =
      await supabaseAdmin
        .from("workspaces")
        .select("*")
        .eq("organization_id", request.organizationId)
        .eq("id", request.slug)
        .single();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,
      organizationId: data.organization_id,
      name: data.name,
      slug: data.id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

}

export const workspaceRepository =
  new WorkspaceRepository();