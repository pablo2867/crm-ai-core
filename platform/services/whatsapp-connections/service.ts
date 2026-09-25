import {
  whatsappConnectionRepository,
} from "@/platform/repositories/whatsapp-connection";

import type {
  CreateWhatsAppConnectionRequest,
  FindWhatsAppConnectionRequest,
} from "@/platform/repositories/whatsapp-connection";

export class WhatsAppConnectionService {
  async findByPhone(
    request: FindWhatsAppConnectionRequest,
  ) {
    return whatsappConnectionRepository.findByPhone(
      request,
    );
  }

  async create(
    request: CreateWhatsAppConnectionRequest,
  ) {
    return whatsappConnectionRepository.create(
      request,
    );
  }
}

export const whatsappConnectionService =
  new WhatsAppConnectionService();
