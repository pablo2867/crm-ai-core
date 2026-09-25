export interface BusinessCatalogItemRecord {
  id: string;
  userId: string;
  organizationId: string;
  workspaceId: string;

  code: string | null;
  name: string;
  description: string | null;
  category: string | null;
  imageUrl: string | null;
  features: string[];
  benefits: string[];
  unit: string | null;
  available: boolean;
  specificRules: string[];

  createdAt: string;
  updatedAt: string;
}

export interface FindBusinessCatalogItemRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  id?: string;
  code?: string | null;
  name?: string;
}

export interface CreateBusinessCatalogItemRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;

  code?: string | null;
  name: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  features?: string[];
  benefits?: string[];
  unit?: string | null;
  available?: boolean;
  specificRules?: string[];
}

export interface UpdateBusinessCatalogItemRequest
  extends FindBusinessCatalogItemRequest {
  code?: string | null;
  name?: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  features?: string[];
  benefits?: string[];
  unit?: string | null;
  available?: boolean;
  specificRules?: string[];
}