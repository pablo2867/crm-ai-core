import { leadRepository } from "@/platform/repositories/lead";
import { billingEngine } from "@/platform/billing";
import { planEnforcementEngine } from "@/platform/billing/enforcement";

import type {
  CreateLeadRequest,
  CreateLeadResult,
  UpdateLeadRequest,
  ChangePipelineRequest,
  FindLeadRequest,
  SearchLeadRequest,
} from "./types";

export class LeadService {
  async createLead(
    request: CreateLeadRequest,
  ): Promise<CreateLeadResult> {

    const count =
      await leadRepository.countByTenant(
        request.organizationId,
        request.workspaceId,
      );

    const subscription =
      await billingEngine.get(
        request.organizationId,
      );

    if (!subscription) {
      throw new Error(
        "SUBSCRIPTION_NOT_FOUND",
      );
    }

    const entitlements =
      billingEngine.getEntitlements(
        subscription.plan,
      );

    const enforcement =
      planEnforcementEngine.check(
        "leads",
        {
          organizationId:
            request.organizationId,
          entitlement:
            entitlements,
          currentUsage:
            count ?? 0,
        },
      );

    if (!enforcement.allowed) {
      throw new Error(
        enforcement.reason ??
          "LEAD_LIMIT_REACHED",
      );
    }

    let aiScore = 60;

    if (
      request.company &&
      request.company.length > 3
    ) {
      aiScore += 10;
    }

    if (request.phone) {
      aiScore += 10;
    }

    if (
      request.email?.includes("@gmail")
    ) {
      aiScore += 5;
    }

    if (
      request.email?.includes("@company")
    ) {
      aiScore += 20;
    }

    let aiTemperature = "WARM";

    if (aiScore >= 85) {
      aiTemperature = "HOT";
    } else if (aiScore <= 50) {
      aiTemperature = "COLD";
    }

    const aiAnalysis =
      "Potencial cliente interesado en informaciÃ³n sobre servicios o productos.";

    const aiFollowup =
      `Hola ${request.name}, seguimos disponibles para ayudarte cuando gustes.`;

    const aiAction =
      "Enviar seguimiento comercial.";

    const data =
      await leadRepository.create({
        name: request.name,
        company: request.company,
        email: request.email,
        phone: request.phone,
        userId: request.userId,
        organizationId:
          request.organizationId,
        workspaceId:
          request.workspaceId,
        status: request.status ?? "Nuevo",
        pipelineStage: "new",
        pipelineStageOrder: 1,
        aiScore,
        aiTemperature,
        aiAnalysis,
        aiFollowup,
        aiAction,
        closeProbability: aiScore,
      });

    return {
      data,
      aiScore,
      aiTemperature,
      aiAnalysis,
      aiFollowup,
      aiAction,
    };
  }

  async updateLead(
    request: UpdateLeadRequest,
  ) {
    return leadRepository.update(
      request,
    );
  }

  async changePipeline(
    request: ChangePipelineRequest,
  ) {
    return leadRepository.updateStatus(
      request,
    );
  }

  async findLead(
    request: FindLeadRequest,
  ) {
    return leadRepository.findById(
      request,
    );
  }

  async searchLeads(
    request: SearchLeadRequest,
  ) {
    return leadRepository.search(
      request,
    );
  }
}

export const leadService =
  new LeadService();

