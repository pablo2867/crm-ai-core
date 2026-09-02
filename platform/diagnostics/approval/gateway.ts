import type {
  ApprovalRepository,
} from "./repository";

import type {
  RepairApprovalDecision,
  RepairApprovalGateway,
  RepairApprovalRequest,
} from "./types";

interface ApprovalContext {

  userId?: string;

  organizationId?: string;

  workspaceId?: string;

}

export class RepositoryRepairApprovalGateway
  implements RepairApprovalGateway {

  constructor(
    private readonly repository:
      ApprovalRepository
  ) {}

  async requestApproval(
    request: RepairApprovalRequest
  ): Promise<RepairApprovalDecision> {

    const existing =
      await this.repository.get(
        request.issueId,
        {

          userId:
            request.userId,

          organizationId:
            request.organizationId,

          workspaceId:
            request.workspaceId,

        }
      );

    if (existing) {

      return existing;

    }

    return this.repository.create(
      request
    );

  }

  async approve(
    issueId: string,
    decidedBy: string,
    reason:
      string =
        "Reparación aprobada.",
    context:
      ApprovalContext = {}
  ): Promise<RepairApprovalDecision> {

    const existing =
      await this.repository.get(
        issueId,
        context
      );

    if (!existing) {

      throw new Error(
        "REPAIR_APPROVAL_NOT_FOUND"
      );

    }

    return this.repository.update({

      ...existing,

      status:
        "approved",

      approved:
        true,

      decidedBy,

      reason,

      decidedAt:
        new Date().toISOString(),

    });

  }

  async reject(
    issueId: string,
    decidedBy: string,
    reason: string,
    context:
      ApprovalContext = {}
  ): Promise<RepairApprovalDecision> {

    const existing =
      await this.repository.get(
        issueId,
        context
      );

    if (!existing) {

      throw new Error(
        "REPAIR_APPROVAL_NOT_FOUND"
      );

    }

    return this.repository.update({

      ...existing,

      status:
        "rejected",

      approved:
        false,

      decidedBy,

      reason,

      decidedAt:
        new Date().toISOString(),

    });

  }

  async getDecision(
    issueId: string,
    context:
      ApprovalContext = {}
  ):
    Promise<
      RepairApprovalDecision |
      undefined
    > {

    return this.repository.get(
      issueId,
      context
    );

  }

}

export class InMemoryApprovalRepository
  implements ApprovalRepository {

  private readonly records =
    new Map<
      string,
      RepairApprovalDecision
    >();

  private key(
    issueId: string,
    context: ApprovalContext = {}
  ): string {

    return [

      context.organizationId ??
        "no-organization",

      context.workspaceId ??
        "no-workspace",

      context.userId ??
        "no-user",

      issueId,

    ].join(":");

  }

  async create(
    request: RepairApprovalRequest
  ): Promise<RepairApprovalDecision> {

    const key =
      this.key(
        request.issueId,
        request
      );

    const existing =
      this.records.get(
        key
      );

    if (existing) {

      return existing;

    }

    const decision:
      RepairApprovalDecision = {

      issueId:
        request.issueId,

      status:
        "pending",

      approved:
        false,

      reason:
        "La reparación requiere aprobación explícita.",

      userId:
        request.userId,

      organizationId:
        request.organizationId,

      workspaceId:
        request.workspaceId,

    };

    this.records.set(
      key,
      decision
    );

    return decision;

  }

  async get(
    issueId: string,
    context: ApprovalContext
  ):
    Promise<
      RepairApprovalDecision |
      undefined
    > {

    return this.records.get(
      this.key(
        issueId,
        context
      )
    );

  }

  async update(
    decision: RepairApprovalDecision
  ):
    Promise<RepairApprovalDecision> {

    const key =
      this.key(
        decision.issueId,
        decision
      );

    this.records.set(
      key,
      decision
    );

    return decision;

  }

}

/*
---------------------------------------
Default Production Gateway
---------------------------------------
*/

import {
  supabaseApprovalRepository,
} from "./supabase-repository";

export const repairApprovalGateway =
  new RepositoryRepairApprovalGateway(
    supabaseApprovalRepository
  );

/*
---------------------------------------
In-Memory Factory
---------------------------------------
*/

export function createInMemoryApprovalGateway() {

  return new RepositoryRepairApprovalGateway(
    new InMemoryApprovalRepository()
  );

}
