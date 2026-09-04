"use client";

import { useMemo, useState } from "react";
import MercadoPagoCardForm from "./MercadoPagoCardForm";

interface BillingCheckoutProps {
  plan: "starter" | "pro" | "business";
  planName: string;
  amount: number;
  payerEmail?: string;
}

export default function BillingCheckout({
  plan,
  planName,
  amount,
  payerEmail = "",
}: BillingCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [cardToken, setCardToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const formattedAmount = useMemo(
    () =>
      new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "USD",
      }).format(amount),
    [amount]
  );

  function handleTokenCreated(token: string) {
    setCardToken(token);
    setStatus(
      "Tarjeta tokenizada correctamente. El backend ya puede crear la suscripción."
    );
  }

  function handleError(message: string) {
    setStatus(message);
    setCardToken(null);
  }

  return (
    <div className="mt-8">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
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
            <p className="text-sm text-zinc-400">Plan seleccionado</p>
            <h3 className="mt-1 text-xl font-black">
              {planName}
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              {formattedAmount} USD / mes
            </p>
          </div>

          <MercadoPagoCardForm
            amount={amount}
            payerEmail={payerEmail}
            onTokenCreated={handleTokenCreated}
            onError={handleError}
          />

          {cardToken && (
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm font-bold text-emerald-300">
                CardToken generado correctamente.
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Plan: {plan}
              </p>
            </div>
          )}

          {status && !cardToken && (
            <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
              {status}
            </p>
          )}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setCardToken(null);
              setStatus(null);
            }}
            className="mt-4 w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/5"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
