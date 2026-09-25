import type {
  Workflow,
} from "./types";

import {
  salesBestLeadWorkflow,
} from "./definitions/sales-best-lead";

import {
  salesLeadRankingWorkflow,
} from "./definitions/sales-lead-ranking";

import {
  salesTaskWorkflow,
} from "./definitions/sales-task";

import {
  salesFollowupWorkflow,
} from "./definitions/sales-followup";

import {
  salesEmailWorkflow,
} from "./definitions/sales-email";

import {
  marketingCampaignWorkflow,
} from "./definitions/marketing-campaign";

import {
  generalChatWorkflow,
} from "./definitions/general-chat";

import {
  dailyPrioritiesWorkflow,
} from "./definitions/daily-priorities";

import {
  commandCenterWorkflow,
} from "./definitions/command-center";

import {
  financialAnalysisWorkflow,
} from "./definitions/financial-analysis";

import {
  whatsappGeneralWorkflow,
} from "./definitions/whatsapp/general";

import {
  whatsappInterestWorkflow,
} from "./definitions/whatsapp/interest";

import {
  whatsappObjectionWorkflow,
} from "./definitions/whatsapp/objection";

import {
  whatsappClosingWorkflow,
} from "./definitions/whatsapp/closing";

import {
  whatsappProposalWorkflow,
} from "./definitions/whatsapp/proposal";

export class WorkflowRegistry {

  private workflows = new Map<
    string,
    Workflow
  >();

  constructor() {

    this.register(
      salesBestLeadWorkflow
    );

    this.register(
      salesLeadRankingWorkflow
    );

    this.register(
      salesTaskWorkflow
    );

    this.register(
      salesFollowupWorkflow
    );

    this.register(
      salesEmailWorkflow
    );

    this.register(
      marketingCampaignWorkflow
    );

    this.register(
      generalChatWorkflow
    );

    this.register(
      dailyPrioritiesWorkflow
    );

    this.register(
      commandCenterWorkflow
    );

    this.register(
      financialAnalysisWorkflow
    );

    this.register(
      whatsappGeneralWorkflow
    );

    this.register(
      whatsappInterestWorkflow
    );

    this.register(
      whatsappObjectionWorkflow
    );

    this.register(
      whatsappClosingWorkflow
    );

    this.register(
      whatsappProposalWorkflow
    );

  }

  register(
    workflow: Workflow
  ) {

    this.workflows.set(
      workflow.id,
      workflow
    );

  }

  get(
    id: string
  ) {

    return this.workflows.get(id);

  }

  getAll() {

    return Array.from(
      this.workflows.values()
    );

  }

  has(
    id: string
  ) {

    return this.workflows.has(id);

  }

}

export const workflowRegistry =
  new WorkflowRegistry();


