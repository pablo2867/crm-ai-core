export interface WhatsAppConnectionTenantContext {
  userId: string;
  organizationId: string;
  workspaceId: string;
}

export interface WhatsAppConnectionRecord
  extends WhatsAppConnectionTenantContext {
  id: string;
  phoneNumber: string;
  provider: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FindWhatsAppConnectionRequest {
  phoneNumber: string;
}

export interface CreateWhatsAppConnectionRequest
  extends WhatsAppConnectionTenantContext {
  phoneNumber: string;
  provider?: string;
  active?: boolean;
}
