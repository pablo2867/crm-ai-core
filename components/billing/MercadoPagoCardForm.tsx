"use client";

import { useEffect, useRef, useState } from "react";
import { loadMercadoPago } from "@mercadopago/sdk-js";

interface CardFormData {
  token?: string;
}

interface CardFormInstance {
  getCardFormData: () => CardFormData;
  unmount?: () => void;
}

interface MercadoPagoInstance {
  cardForm: (config: Record<string, unknown>) => CardFormInstance;
}

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: {
        locale?: string;
      }
    ) => MercadoPagoInstance;
  }
}

interface MercadoPagoCardFormProps {
  amount: number;
  payerEmail: string;
  onTokenCreated: (token: string) => void;
  onError?: (message: string) => void;
}

export default function MercadoPagoCardForm({
  amount,
  payerEmail,
  onTokenCreated,
  onError,
}: MercadoPagoCardFormProps) {
  const cardFormRef = useRef<CardFormInstance | null>(null);

  const callbacksRef = useRef({
    onTokenCreated,
    onError,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    callbacksRef.current = {
      onTokenCreated,
      onError,
    };
  }, [onTokenCreated, onError]);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const publicKey =
          process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;

        if (!publicKey) {
          throw new Error(
            "NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no está configurada."
          );
        }

        await loadMercadoPago();

        if (cancelled) return;

        if (!window.MercadoPago) {
          throw new Error(
            "MercadoPago.js no pudo inicializarse."
          );
        }

        const mp = new window.MercadoPago(publicKey, {
          locale: "es-MX",
        });

        cardFormRef.current = mp.cardForm({
          amount: amount.toFixed(2),
          iframe: true,

          form: {
            id: "form-checkout",

            cardNumber: {
              id: "form-checkout__cardNumber",
              placeholder: "Número de tarjeta",
            },

            expirationDate: {
              id: "form-checkout__expirationDate",
              placeholder: "MM/YY",
            },

            securityCode: {
              id: "form-checkout__securityCode",
              placeholder: "Código de seguridad",
            },

            cardholderName: {
              id: "form-checkout__cardholderName",
              placeholder: "Titular de la tarjeta",
            },

            issuer: {
              id: "form-checkout__issuer",
              placeholder: "Banco emisor",
            },

            installments: {
              id: "form-checkout__installments",
              placeholder: "Cuotas",
            },

            identificationType: {
              id: "form-checkout__identificationType",
              placeholder: "Tipo de identificación",
            },

            identificationNumber: {
              id: "form-checkout__identificationNumber",
              placeholder: "Número de identificación",
            },

            cardholderEmail: {
              id: "form-checkout__cardholderEmail",
            },
          },

          callbacks: {
            onFormMounted: (mountError: unknown) => {
              if (cancelled) return;

              setLoading(false);

              if (mountError) {
                const message =
                  "No fue posible cargar el formulario de pago.";

                setError(message);
                callbacksRef.current.onError?.(message);

                return;
              }

              setError(null);
            },

            onSubmit: (event: Event) => {
              event.preventDefault();

              try {
                const data =
                  cardFormRef.current?.getCardFormData();

                const token = data?.token;

                if (!token) {
                  throw new Error(
                    "Mercado Pago no generó el CardToken."
                  );
                }

                callbacksRef.current.onTokenCreated(token);
              } catch (submitError) {
                const message =
                  submitError instanceof Error
                    ? submitError.message
                    : "Error generando CardToken.";

                setError(message);
                callbacksRef.current.onError?.(message);
              }
            },
          },
        });
      } catch (initializationError) {
        if (cancelled) return;

        const message =
          initializationError instanceof Error
            ? initializationError.message
            : "Error inicializando Mercado Pago.";

        setLoading(false);
        setError(message);
        callbacksRef.current.onError?.(message);
      }
    }

    initialize();

    return () => {
      cancelled = true;

      try {
        cardFormRef.current?.unmount?.();
      } catch {
        // Ignorar errores durante la limpieza.
      }

      cardFormRef.current = null;
    };
  }, [amount]);

  return (
    <form id="form-checkout" className="space-y-4">
      <div>
        <label
          htmlFor="form-checkout__cardNumber"
          className="mb-1 block text-sm font-medium"
        >
          Número de tarjeta
        </label>

        <div
          id="form-checkout__cardNumber"
          className="min-h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3"
        />
      </div>

      <div>
        <label
          htmlFor="form-checkout__expirationDate"
          className="mb-1 block text-sm font-medium"
        >
          Vencimiento
        </label>

        <div
          id="form-checkout__expirationDate"
          className="min-h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3"
        />
      </div>

      <div>
        <label
          htmlFor="form-checkout__securityCode"
          className="mb-1 block text-sm font-medium"
        >
          Código de seguridad
        </label>

        <div
          id="form-checkout__securityCode"
          className="min-h-11 rounded-xl border border-white/10 bg-white/[0.03] px-3"
        />
      </div>

      <input
        id="form-checkout__cardholderName"
        name="cardholderName"
        placeholder="Titular de la tarjeta"
        autoComplete="cc-name"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
      />

      <select
        id="form-checkout__issuer"
        name="issuer"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
        defaultValue=""
      >
        <option value="" disabled>
          Banco emisor
        </option>
      </select>

      <select
        id="form-checkout__installments"
        name="installments"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
        defaultValue=""
      >
        <option value="" disabled>
          Cuotas
        </option>
      </select>

      <select
        id="form-checkout__identificationType"
        name="identificationType"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
        defaultValue=""
      >
        <option value="" disabled>
          Tipo de identificación
        </option>
      </select>

      <input
        id="form-checkout__identificationNumber"
        name="identificationNumber"
        placeholder="Número de identificación"
        autoComplete="off"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
      />

      <input
        id="form-checkout__cardholderEmail"
        name="cardholderEmail"
        type="email"
        defaultValue={payerEmail}
        placeholder="Correo electrónico"
        autoComplete="email"
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
      />

      {loading && (
        <p className="text-sm text-zinc-400">
          Cargando formulario de pago...
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        id="form-checkout__submit"
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-orange-500 px-5 py-3 font-bold transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar con el pago
      </button>
    </form>
  );
}
