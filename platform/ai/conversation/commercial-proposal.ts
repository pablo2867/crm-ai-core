import {
  businessCatalogService,
} from "@/platform/services/business-catalog";

import {
  pricingQuotation,
} from "@/platform/ai/pricing";

import type {
  CommercialConversationData,
} from "./commercial-intelligence";

export interface CommercialProposalRequest {
  userId: string;
  organizationId: string;
  workspaceId: string;
  customerName?: string | null;
  data: CommercialConversationData;
}

export interface CommercialProposalResult {
  success: boolean;
  reason:
    | "proposal_ready"
    | "product_required"
    | "product_not_found"
    | "quantity_required"
    | "price_not_configured"
    | "invalid_quantity";

  productId: string | null;
  productName: string | null;
  imageUrl: string | null;
  quantity: number | null;
  unitPrice: number | null;
  minimumPrice: number | null;
  maximumPrice: number | null;
  subtotal: number | null;
  currency: string | null;
  unit: string | null;
  conditions: string[];
  notes: string | null;
  text: string | null;
}

function normalizeText(
  value: string,
): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function extractQuantity(
  value: string | null,
): number | null {
  if (!value) {
    return null;
  }

  const match =
    value.match(/\d+(?:[.,]\d+)?/);

  if (!match) {
    return null;
  }

  const quantity =
    Number(
      match[0].replace(",", "."),
    );

  return Number.isFinite(quantity) &&
    quantity > 0
    ? quantity
    : null;
}

function buildProposalText(
  productName: string,
  quantity: number,
  unit: string | null,
  unitPrice: number | null,
  minimumPrice: number | null,
  maximumPrice: number | null,
  subtotal: number | null,
  currency: string | null,
  conditions: string[],
): string {

  const priceText =
    unitPrice != null
      ? `${currency ?? "MXN"} $${unitPrice.toFixed(2)}`
      : minimumPrice != null &&
          maximumPrice != null
        ? `${currency ?? "MXN"} $${minimumPrice.toFixed(2)} a $${maximumPrice.toFixed(2)}`
        : null;

  const quantityText =
    `${quantity}${unit ? ` ${unit}` : ""}`;

  const lines: string[] = [
    `Te puedo preparar la siguiente propuesta:`,
    ``,
    `Producto: ${productName}`,
    `Cantidad: ${quantityText}`,
  ];

  if (priceText) {
    lines.push(
      `Precio unitario: ${priceText}`,
    );
  }

  if (subtotal != null) {
    lines.push(
      `Subtotal: ${currency ?? "MXN"} $${subtotal.toFixed(2)}`,
    );
  }

  if (conditions.length > 0) {
    lines.push(
      `Condiciones: ${conditions.join("; ")}`,
    );
  }

  return lines.join("\n");
}

export class CommercialProposalEngine {

  async generate(
    request: CommercialProposalRequest,
  ): Promise<CommercialProposalResult> {

    const productName =
      request.data.productOrService?.trim();

    if (!productName) {
      return {
        success: false,
        reason: "product_required",
        productId: null,
        productName: null,
        imageUrl: null,
        quantity: null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        notes: null,
        text: null,
      };
    }

    const quantity =
      extractQuantity(
        request.data.quantity,
      );

    if (quantity == null) {
      return {
        success: false,
        reason: "quantity_required",
        productId: null,
        productName,
        imageUrl: null,
        quantity: null,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        notes: null,
        text: null,
      };
    }

    const catalogItems =
      await businessCatalogService.list({
        userId: request.userId,
        organizationId:
          request.organizationId,
        workspaceId:
          request.workspaceId,
      });

    const normalizedProduct =
      normalizeText(productName);

    const exactMatch =
      catalogItems.find(
        item =>
          normalizeText(item.name) ===
          normalizedProduct,
      );

    const partialMatch =
      exactMatch ??
      catalogItems.find(item => {
        const name =
          normalizeText(item.name);

        return (
          name.includes(normalizedProduct) ||
          normalizedProduct.includes(name)
        );
      });

    if (!partialMatch) {
      return {
        success: false,
        reason: "product_not_found",
        productId: null,
        productName,
        imageUrl: null,
        quantity,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions: [],
        notes: null,
        text: null,
      };
    }

    const quotation =
      await pricingQuotation.create({
        userId: request.userId,
        organizationId:
          request.organizationId,
        workspaceId:
          request.workspaceId,
        catalogItemId: partialMatch.id,
        quantity,
        customerName:
          request.customerName ?? undefined,
        notes:
          request.data.requirements.length > 0
            ? request.data.requirements.join("; ")
            : undefined,
      });

    if (!quotation.success) {

      const reason =
        quotation.reason ===
        "INVALID_QUANTITY"
          ? "invalid_quantity"
          : "price_not_configured";

      return {
        success: false,
        reason,
        productId: partialMatch.id,
        productName: partialMatch.name,
        imageUrl: partialMatch.imageUrl ?? null,
        quantity,
        unitPrice: null,
        minimumPrice: null,
        maximumPrice: null,
        subtotal: null,
        currency: null,
        unit: null,
        conditions:
          quotation.conditions ?? [],
        notes:
          quotation.notes ?? null,
        text: null,
      };
    }

    const text =
      buildProposalText(
        partialMatch.name,
        quantity,
        quotation.unit,
        quotation.unitPrice,
        quotation.minimumPrice,
        quotation.maximumPrice,
        quotation.subtotal,
        quotation.currency,
        quotation.conditions ?? [],
      );

    return {
      success: true,
      reason: "proposal_ready",
      productId: partialMatch.id,
      productName: partialMatch.name,
      imageUrl: partialMatch.imageUrl ?? null,
      quantity,
      unitPrice:
        quotation.unitPrice,
      minimumPrice:
        quotation.minimumPrice,
      maximumPrice:
        quotation.maximumPrice,
      subtotal:
        quotation.subtotal,
      currency:
        quotation.currency,
      unit:
        quotation.unit,
      conditions:
        quotation.conditions ?? [],
      notes:
        quotation.notes ?? null,
      text,
    };
  }
}

export const commercialProposalEngine =
  new CommercialProposalEngine();



