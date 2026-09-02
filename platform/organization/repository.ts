import { supabaseAdmin } from "@/lib/supabase-admin";

import type {
  CreateOrganizationRequest,
  FindOrganizationBySlugRequest,
  FindOrganizationRequest,
  Organization,
} from "./types";

export class OrganizationRepository {

  async create(
    request: CreateOrganizationRequest
  ): Promise<Organization> {

    const slug =
      request.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

    const { data, error } =
      await supabaseAdmin
        .from("organizations")
        .insert({
          name: request.name,
          slug,
          active: true,
          plan: "free",
        })
        .select()
        .single();

    if (error || !data) {

      throw new Error(
        error?.message ??
        "ORGANIZATION_CREATE_FAILED"
      );

    }

    return {

      id: data.id,
      name: data.name,
      slug: data.slug,
      ownerId: request.ownerId,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

  async findById(
    request: FindOrganizationRequest
  ): Promise<Organization | null> {

    const { data, error } =
      await supabaseAdmin
        .from("organizations")
        .select("*")
        .eq("id", request.id)
        .single();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,
      name: data.name,
      slug: data.slug,
      ownerId: "",
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

  async findBySlug(
    request: FindOrganizationBySlugRequest
  ): Promise<Organization | null> {

    const { data, error } =
      await supabaseAdmin
        .from("organizations")
        .select("*")
        .eq("slug", request.slug)
        .single();

    if (error || !data) {

      return null;

    }

    return {

      id: data.id,
      name: data.name,
      slug: data.slug,
      ownerId: "",
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),

    };

  }

}

export const organizationRepository =
  new OrganizationRepository();