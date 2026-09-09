"use client";

import { useMemo, useState } from "react";
import MercadoPagoCardForm from "./MercadoPagoCardForm";

interface BillingCheckoutProps {
  plan: "starter" | "pro" | "business";
  planName: string;
  amount: number;
  payerEmail?: string;
}

interface SubscriptionResponse {
  success?: boolean;
  status?: string;
  providerSubscriptionId?: string;
  error?: string;
  step?: string;
  plan?: string;
}

export default function BillingCheckout({
  plan,
  planName,
  amount,
  payerEmail = "",
}: BillingCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] =
    useState<string | null>(null);

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
      }).format(amount),
    [amount]
  );

  async function handleTokenCreated(token: string) {
    setProcessing(true);
    setCompleted(false);
    setStatus("Creando tu suscripción...");
    setSubscriptionId(null);

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan,
          cardTokenId: token,
          payerEmail,
        }),
      });

      const data =
        (await response.json()) as SubscriptionResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "No fue posible crear la suscripción."
        );
      }

      setCompleted(true);
      setSubscriptionId(
        data.providerSubscriptionId ?? null
      );
      setStatus(
        "Suscripción creada correctamente."
      );
    } catch (error) {
      setCompleted(false);
      setSubscriptionId(null);

      setStatus(
        error instanceof Error
          ? error.message
          : "No fue posible crear la suscripción."
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleError(message: string) {
    setCompleted(false);
    setSubscriptionId(null);
    setProcessing(false);
    setStatus(message);
  }

  return (
    <div className="mt-8">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setStatus(null);
            setCompleted(false);
            setSubscriptionId(null);
          }}
          className={`block w-full rounded-xl px-5 py-3 text-center font-bold transition ${
            plan === "pro"
              ? "bg-orange-500 hover:bg-orange-400"
              : "bg-white/10 hover:bg-white/15"
          }`}
        >
          Elegir {planName}
        </button>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="mb-5">
            <p className="text-sm text-zinc-400">
              Plan seleccionado
            </p>

            <h3 className="mt-1 text-xl font-black">
              {planName}
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              {formattedAmount} MXN / mes
            </p>
          </div>

          {!completed && (
            <MercadoPagoCardForm
              amount={amount}
              payerEmail={payerEmail}
              onTokenCreated={handleTokenCreated}
              onError={handleError}
            />
          )}

          {processing && (
            <div className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">
              <p className="text-sm font-bold text-orange-300">
                Procesando suscripción...
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Estamos registrando tu autorización con
                Mercado Pago.
              </p>
            </div>
          )}

          {completed && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-bold text-emerald-300">
                Suscripción creada correctamente.
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                Plan: {planName}
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                Mercado Pago confirmó la creación de la
                suscripción.
              </p>

              {subscriptionId && (
                <p className="mt-2 text-xs text-zinc-500">
                  ID de suscripción recibido correctamente.
                </p>
              )}
            </div>
          )}

          {status && !processing && !completed && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm text-zinc-300">
                {status}
              </p>
            </div>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={() => {
              setOpen(false);
              setProcessing(false);
              setCompleted(false);
              setStatus(null);
              setSubscriptionId(null);
            }}
            className="mt-4 w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

