import { MercadoPagoConfig, PreApproval, PreApprovalPlan } from "mercadopago";

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
}

export const mercadopagoClient = new MercadoPagoConfig({
  accessToken,
});

export const preApprovalClient =
  new PreApproval(mercadopagoClient);

export const preApprovalPlanClient =
  new PreApprovalPlan(mercadopagoClient);
