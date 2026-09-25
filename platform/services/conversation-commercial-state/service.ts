import {
  conversationCommercialStateRepository,
} from "@/platform/repositories/conversation-commercial-state";

import type { CommercialConversationData } from "@/platform/ai/conversation/commercial-intelligence";
import type { OpportunityState } from "@/platform/ai/conversation/opportunity-state";
import type { ObjectionIntelligenceResult } from "@/platform/ai/conversation/objection-intelligence";
import type { QualificationIntelligence } from "@/platform/ai/conversation/qualification-intelligence";

export interface PersistCommercialStateRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  conversationId: string;
  commercialData: CommercialConversationData;
  opportunityState: OpportunityState;
  objections: ObjectionIntelligenceResult;
  qualification: QualificationIntelligence;
}

export class ConversationCommercialStateService {
  async persist(
    request: PersistCommercialStateRequest,
  ) {
    return conversationCommercialStateRepository.upsert({
      conversationId: request.conversationId,
      userId: request.userId,
      organizationId: request.organizationId,
      workspaceId: request.workspaceId,
      commercialData: request.commercialData as unknown as Record<string, unknown>,
      opportunityState: request.opportunityState as unknown as Record<string, unknown>,
      objections: request.objections.objections,
      qualification: request.qualification as unknown as Record<string, unknown>,
    });
  }

  async get(
    request: {
      userId: string;
      organizationId: string;
      workspaceId: string;
      conversationId: string;
    },
  ) {
    return conversationCommercialStateRepository.findByConversation(
      request,
    );
  }
}

export const conversationCommercialStateService =
  new ConversationCommercialStateService();

