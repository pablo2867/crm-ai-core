export interface BusinessProfileRecord {
  id: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  businessName: string;
  description: string | null;
  businessType: string | null;
  targetCustomer: string | null;
  valueProposition: string | null;
  communicationTone: string | null;
  businessHours: Record<string, unknown>;
  policies: string[];
  commercialRules: string[];

  createdAt: string;
  updatedAt: string;
}

export interface FindBusinessProfileRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface CreateBusinessProfileRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  businessName: string;
  description?: string | null;
  businessType?: string | null;
  targetCustomer?: string | null;
  valueProposition?: string | null;
  communicationTone?: string | null;
  businessHours?: Record<string, unknown>;
  policies?: string[];
  commercialRules?: string[];
}

export interface UpdateBusinessProfileRequest
  extends FindBusinessProfileRequest {
  businessName?: string;
  description?: string | null;
  businessType?: string | null;
  targetCustomer?: string | null;
  valueProposition?: string | null;
  communicationTone?: string | null;
  businessHours?: Record<string, unknown>;
  policies?: string[];
  commercialRules?: string[];
}