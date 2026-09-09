import {
  preApprovalClient,
  preApprovalPlanClient,
} from "./client";

import type {
  CreatePaymentPlanRequest,
  PaymentPlanResult,
  CreatePaymentSubscriptionRequest,
  PaymentSubscriptionResult,
  PaymentSubscriptionStatusResult,
} from "./types";

export class MercadoPagoAdapter {
  async createPlan(
    request: CreatePaymentPlanRequest
  ): Promise<PaymentPlanResult> {
    try {
      const response = await preApprovalPlanClient.create({
        body: {
          reason: request.reason,
          auto_recurring: {
            frequency: 1,
            frequency_type:
              request.interval === "year" ? "years" : "months",
            transaction_amount: request.amount,
            currency_id: request.currencyId,
          },
          back_url: request.backUrl,
        },
      });

      return {
        providerPlanId: String(response.id),
        reason: response.reason ?? request.reason,
        amount:
          response.auto_recurring?.transaction_amount ??
          request.amount,
        currencyId:
          response.auto_recurring?.currency_id ??
          request.currencyId,
        frequency:
          response.auto_recurring?.frequency ?? 1,
        frequencyType:
          response.auto_recurring?.frequency_type ??
          (request.interval === "year" ? "years" : "months"),
      };
    } catch (error) {
      throw new Error(
        `MERCADOPAGO_PLAN_CREATE_FAILED: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }

  async getPlan(providerPlanId: string) {
    try {
      return await preApprovalPlanClient.get({
        preApprovalPlanId: providerPlanId,
      });
    } catch (error) {
      throw new Error(
        `MERCADOPAGO_PLAN_GET_FAILED: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }

  async createSubscription(
    request: CreatePaymentSubscriptionRequest
  ): Promise<PaymentSubscriptionResult> {
    try {
      const body: Record<string, unknown> = {
        reason: request.reason,
        external_reference: request.externalReference,
        payer_email: request.payerEmail,
        card_token_id: request.cardTokenId,
        back_url: request.backUrl,
      };

      if (request.providerPlanId) {
        body.preapproval_plan_id =
          request.providerPlanId;

        body.status = "authorized";
      }

      const response = await preApprovalClient.create({
        body,
      });

      return {
        providerSubscriptionId: String(response.id),
        status: response.status ?? "authorized",
        payerEmail: response.payer_email ?? null,
        reason: response.reason ?? null,
      };
    } catch (error) {
      throw new Error(
        `MERCADOPAGO_SUBSCRIPTION_CREATE_FAILED: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }
  async getSubscription(
    providerSubscriptionId: string
  ): Promise<PaymentSubscriptionStatusResult> {
    try {
      const response =
        await preApprovalClient.get({
          id: providerSubscriptionId,
        });

      return {
        providerSubscriptionId: String(response.id),
        status: String(response.status ?? "unknown"),
      };
    } catch (error) {
      throw new Error(
        `MERCADOPAGO_SUBSCRIPTION_NOT_FOUND: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }

  async cancelSubscription(
    providerSubscriptionId: string
  ) {
    try {
      return await preApprovalClient.update({
        id: providerSubscriptionId,
        body: {
          status: "canceled",
        },
      });
    } catch (error) {
      throw new Error(
        `MERCADOPAGO_SUBSCRIPTION_CANCEL_FAILED: ${
          error instanceof Error
            ? error.message
            : "Unknown error"
        }`
      );
    }
  }
}

export const mercadoPagoAdapter =
  new MercadoPagoAdapter();




