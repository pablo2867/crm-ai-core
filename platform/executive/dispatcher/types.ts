export interface RecommendationAction {

  recommendationId: string;

  capabilityId: string;

}

export interface DispatchRequest {

  userId?: string;

  recommendations: {

    id: string;

  }[];

}

export interface DispatchResult {

  executed: string[];

}