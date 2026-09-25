import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  CreateMembershipRequest,
  FindMembershipRequest,
  Membership,
} from "./types";

export class MembershipRepository {

  async create(
    request: CreateMembershipRequest
  ): Promise<Membership> {

    const { data, error } =
      await supabaseAdmin
        .from("organization_members")
        .insert({
          organization_id: request.organizationId,
          workspace_id: request.workspaceId,
          user_id: request.userId,
          role: request.role,
          active: true,
        })
        .select()
        .single();

    if (error || !data) {

      throw new Error(
        error?.message ??
        "MEMBERSHIP_CREATE_FAILED"
      );

    }

    return {

      id: data.id,
      organizationId: data.organization_id,
      workspaceId: data.workspace_id,
      userId: data.user_id,
      role: data.role,
      active: data.active,
      createdAt: data.invited_at
        ? new Date(data.invited_at)
        : new Date(),
      updatedAt: data.accepted_at
        ? new Date(data.accepted_at)
        : new Date(),

    };

  }

  async find(
    request: FindMembershipRequest
  ): Promise<Membership | null> {

    let query =
      supabaseAdmin
        .from("organization_members")
        .select("*")
        .eq("user_id", request.userId)
        .eq("active", true);

    if (request.organizationId) {

      query = query.eq(
        "organization_id",
        request.organizationId
      );

    }

    if (request.workspaceId) {

      query = query.eq(
        "workspace_id",
        request.workspaceId
      );

    }

    const { data, error } =
      await query.single();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,
      organizationId: data.organization_id,
      workspaceId: data.workspace_id,
      userId: data.user_id,
      role: data.role,
      active: data.active,
      createdAt: data.invited_at
        ? new Date(data.invited_at)
        : new Date(),
      updatedAt: data.accepted_at
        ? new Date(data.accepted_at)
        : new Date(),

    };

  }


  async countByOrganization(
    organizationId: string
  ): Promise<number> {

    const { count, error } =
      await supabaseAdmin
        .from("organization_members")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("organization_id", organizationId)
        .eq("active", true);

    if (error) {
      throw new Error(
        error.message
      );
    }

    return count ?? 0;
  }
}

export const membershipRepository =
  new MembershipRepository();
