import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

import type {
  CreateLeadData,
  UpdateLeadData,
  UpdateLeadStatusData,
  FindLeadData,
  SearchLeadData,
  DeleteLeadData,
} from "./types";

export class LeadRepository {

  /*
  ---------------------------------------
  Create Lead
  ---------------------------------------
  */

  async countByTenant(
    organizationId: string,
    workspaceId: string,
  ): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from("leads")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("organization_id", organizationId)
      .eq("workspace_id", workspaceId);

    if (error) {
      throw error;
    }

    return count ?? 0;
  }
  async create(
    lead: CreateLeadData,
  ) {

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("leads")

      .insert([
        {
          name:
            lead.name,

          company:
            lead.company,

          email:
            lead.email,

          phone:
            lead.phone,

          user_id:
            lead.userId,

          organization_id:
            lead.organizationId,

          workspace_id:
            lead.workspaceId,

          status:
            lead.status,

          pipeline_stage:
            lead.pipelineStage,

          pipeline_stage_order:
            lead.pipelineStageOrder,

          ai_score:
            lead.aiScore,

          ai_temperature:
            lead.aiTemperature,

          ai_analysis:
            lead.aiAnalysis,

          ai_followup:
            lead.aiFollowup,

          ai_action:
            lead.aiAction,

          close_probability:
            lead.closeProbability,
        },
      ])

      .select()

      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /*
  ---------------------------------------
  Update Lead
  ---------------------------------------
  */

  async update(
    request: UpdateLeadData,
  ) {

    const {
      error,
    } = await supabaseAdmin

      .from("leads")

      .update(
        request.values,
      )

      .eq(
        "id",
        request.id,
      )

      .eq(
        "user_id",
        request.userId,
      )

      .eq(
        "organization_id",
        request.organizationId,
      )

      .eq(
        "workspace_id",
        request.workspaceId,
      );

    if (error) {
      throw error;
    }

    return true;
  }

  /*
  ---------------------------------------
  Update Pipeline Stage
  ---------------------------------------
  */

  async updateStatus(
    request: UpdateLeadStatusData,
  ) {

    const {
      error,
    } = await supabaseAdmin

      .from("leads")

      .update({
        pipeline_stage:
          request.pipelineStage,
      })

      .eq(
        "id",
        request.id,
      )

      .eq(
        "user_id",
        request.userId,
      )

      .eq(
        "organization_id",
        request.organizationId,
      )

      .eq(
        "workspace_id",
        request.workspaceId,
      );

    if (error) {
      throw error;
    }

    return true;
  }

  /*
  ---------------------------------------
  Delete Lead
  ---------------------------------------
  */

  async delete(
    request: DeleteLeadData,
  ) {

    const {
      error,
    } = await supabaseAdmin

      .from("leads")

      .delete()

      .eq(
        "id",
        request.id,
      )

      .eq(
        "user_id",
        request.userId,
      )

      .eq(
        "organization_id",
        request.organizationId,
      )

      .eq(
        "workspace_id",
        request.workspaceId,
      );

    if (error) {
      throw error;
    }

    return true;
  }
  /*
  ---------------------------------------
  Find Lead By Id
  ---------------------------------------
  */

  async findById(
    request: FindLeadData,
  ) {

    const {
      data,
      error,
    } = await supabaseAdmin

      .from("leads")

      .select("*")

      .eq(
        "id",
        request.id,
      )

      .eq(
        "user_id",
        request.userId,
      )

      .eq(
        "organization_id",
        request.organizationId,
      )

      .eq(
        "workspace_id",
        request.workspaceId,
      )

      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /*
  ---------------------------------------
  Search Leads (Enterprise)
  ---------------------------------------
  */

  async search(
    request: SearchLeadData,
  ) {

    let query =
      supabaseAdmin

        .from("leads")

        .select(`
          id,
          user_id,
          name,
          company,
          email,
          ai_score,
          ai_temperature,
          close_probability,
          estimated_revenue,
          pipeline_stage
        `)

        .eq(
          "user_id",
          request.userId,
        )

        .eq(
          "organization_id",
          request.organizationId,
        )

        .eq(
          "workspace_id",
          request.workspaceId,
        );

    if (request.status) {

      query = query.eq(
        "status",
        request.status,
      );

    }

    if (request.pipelineStage) {

      query = query.eq(
        "pipeline_stage",
        request.pipelineStage,
      );

    }

    if (request.aiTemperature) {

      query = query.eq(
        "ai_temperature",
        request.aiTemperature,
      );

    }

    if (
      request.minScore !== undefined
    ) {

      query = query.gte(
        "ai_score",
        request.minScore,
      );

    }

    if (
      request.maxScore !== undefined
    ) {

      query = query.lte(
        "ai_score",
        request.maxScore,
      );

    }

    query = query.order(

      request.orderBy ??
        "created_at",

      {
        ascending:
          request.ascending ??
          false,
      },
    );

    if (
      request.offset !== undefined &&
      request.limit !== undefined
    ) {

      query = query.range(

        request.offset,

        request.offset +
          request.limit -
          1,
      );

    }

    else if (
      request.limit !== undefined
    ) {

      query = query.limit(
        request.limit,
      );

    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      throw error;
    }

    return data ?? [];
  }

}

export const leadRepository =
  new LeadRepository();






