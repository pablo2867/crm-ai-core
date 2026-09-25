"use client";

import { useEffect, useState } from "react";

interface Conversation {
  id: string;
  contact_phone: string;
  contact_name?: string | null;
  channel: string;
  status: string;
  last_message_at?: string | null;
  created_at?: string;
}

interface Message {
  id: string;
  direction: "inbound" | "outbound";
  body: string;
  created_at: string;
  status?: string;
}

interface HandoffState {
  id?: string;
  status?:
    | "pending"
    | "assigned"
    | "in_progress"
    | "resolved"
    | "cancelled";
  reason?: string | null;
  intent?: string | null;
  confidence?: number | null;
  assigned_to?: string | null;
  requested_at?: string | null;
  assigned_at?: string | null;
  started_at?: string | null;
}

interface CommercialState {
  commercial_data?: {
    productOrService?: string | null;
    customerType?: string | null;
    quantity?: string | null;
    need?: string | null;
    requirements?: string[];
    budget?: string | null;
    price?: string | null;
    conditions?: string[];
    objections?: string[];
    knownData?: string[];
    missingData?: string[];
  };
  opportunity_state?: {
    stage?: string;
    interestLevel?: string;
    purchaseIntent?: string;
    readiness?: string;
    hasObjection?: boolean;
    hasBudget?: boolean;
    hasNeed?: boolean;
    hasQuantity?: boolean;
    lastCommercialEvent?: string;
  };
  objections?: {
    hasObjection?: boolean;
    count?: number;
    objections?: Array<{
      type?: string;
      text?: string;
      severity?: string;
      status?: string;
      resolved?: boolean;
    }>;
  };
  qualification?: {
    level?: string;
    productKnown?: boolean;
    needKnown?: boolean;
    quantityKnown?: boolean;
    budgetKnown?: boolean;
    requirementsKnown?: boolean;
    missingInformation?: string[];
    qualificationScore?: number;
  };
}

function isTechnicalMessage(body: string) {
  const value = body.trim().toLowerCase();

  if (!value) return true;

  const technicalPatterns = [
    "○ compiling",
    "✓ compiled",
    "whatsapp_inbound_message_saved",
    "whatsapp_commercial_state",
    "whatsapp_conversation_memory",
    "whatsapp_human_handoff",
    "post /api/",
    "get /api/",
    "application-code:",
    "next.js:",
    "webpack",
    "turbopack",
    "node_modules/",
  ];

  return technicalPatterns.some((pattern) =>
    value.includes(pattern),
  );
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "No registrado";
  }

  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  return String(value);
}

function handoffStatusLabel(status?: string) {
  switch (status) {
    case "pending":
      return "Pendiente";
    case "assigned":
      return "Asignado";
    case "in_progress":
      return "En atención";
    case "resolved":
      return "Resuelto";
    case "cancelled":
      return "Cancelado";
    default:
      return formatValue(status);
  }
}

export default function ConversationCenter() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [commercialState, setCommercialState] =
    useState<CommercialState | null>(null);

  const [handoff, setHandoff] =
    useState<HandoffState | null>(null);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] =
    useState(false);
  const [commercialLoading, setCommercialLoading] =
    useState(false);
  const [handoffLoading, setHandoffLoading] =
    useState(false);
  const [handoffActionLoading, setHandoffActionLoading] =
    useState(false);

  useEffect(() => {
    async function loadConversations() {
      try {
        const response = await fetch(
          "/api/whatsapp/conversations?channel=whatsapp&limit=50",
          {
            cache: "no-store",
          },
        );

        const result = await response.json();

        if (result.success) {
          setConversations(result.data ?? []);
        }
      } catch (error) {
        console.error(
          "CONVERSATION_CENTER_LOAD_ERROR:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

  async function loadHandoff(conversationId: string) {
    setHandoffLoading(true);

    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${conversationId}/handoff`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (result.success) {
        setHandoff(result.data ?? null);
      } else {
        setHandoff(null);
      }
    } catch (error) {
      console.error(
        "CONVERSATION_HANDOFF_LOAD_ERROR:",
        error,
      );

      setHandoff(null);
    } finally {
      setHandoffLoading(false);
    }
  }

  async function loadCommercialState(
    conversationId: string,
  ) {
    setCommercialLoading(true);

    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${conversationId}/commercial-state`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (result.success) {
        setCommercialState(result.data ?? null);
      } else {
        setCommercialState(null);
      }
    } catch (error) {
      console.error(
        "CONVERSATION_COMMERCIAL_STATE_LOAD_ERROR:",
        error,
      );

      setCommercialState(null);
    } finally {
      setCommercialLoading(false);
    }
  }

  async function selectConversation(
    conversation: Conversation,
  ) {
    setSelectedConversation(conversation);
    setMessages([]);
    setCommercialState(null);
    setHandoff(null);

    setMessagesLoading(true);

    try {
      const response = await fetch(
        `/api/whatsapp/conversations/${conversation.id}/messages?limit=200`,
        {
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (result.success) {
        const cleanMessages = (result.data ?? []).filter(
          (message: Message) =>
            !isTechnicalMessage(message.body),
        );

        setMessages(cleanMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "CONVERSATION_MESSAGES_LOAD_ERROR:",
        error,
      );

      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }

    await Promise.all([
      loadCommercialState(conversation.id),
      loadHandoff(conversation.id),
    ]);
  }

  async function executeHandoffAction(
    action:
      | "assign"
      | "start"
      | "resolve"
      | "cancel",
  ) {
    if (!selectedConversation) return;

    setHandoffActionLoading(true);

    try {
      const body: {
        action: string;
        assignedTo?: string;
        resolutionNote?: string;
      } = {
        action,
      };

      if (action === "assign") {
        body.assignedTo = undefined;
      }

      if (action === "resolve") {
        body.resolutionNote =
          "Atención humana resuelta desde Conversation Center.";
      }

      const response = await fetch(
        `/api/whatsapp/conversations/${selectedConversation.id}/handoff`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const result = await response.json();

      if (!result.success) {
        console.error(
          "CONVERSATION_HANDOFF_ACTION_ERROR:",
          result.error,
        );
        return;
      }

      setHandoff(result.data ?? null);

      await loadHandoff(selectedConversation.id);
    } catch (error) {
      console.error(
        "CONVERSATION_HANDOFF_ACTION_ERROR:",
        error,
      );
    } finally {
      setHandoffActionLoading(false);
    }
  }

  const opportunity =
    commercialState?.opportunity_state;

  const commercial =
    commercialState?.commercial_data;

  const qualification =
    commercialState?.qualification;

  const objections =
    commercialState?.objections;

  return (
    <main className="min-h-screen bg-[#09090B] p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            WhatsApp Conversation Center
          </h1>

          <p className="mt-2 text-zinc-400">
            Gestión de conversaciones de WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <section className="rounded-3xl border border-zinc-800 bg-[#111113] p-4">
            <h2 className="mb-4 text-lg font-bold">
              Conversaciones
            </h2>

            {loading ? (
              <div className="py-8 text-center text-zinc-500">
                Cargando conversaciones...
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">
                No hay conversaciones.
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const selected =
                    selectedConversation?.id ===
                    conversation.id;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() =>
                        selectConversation(conversation)
                      }
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">
                          {conversation.contact_name ||
                            conversation.contact_phone}
                        </span>

                        <span className="text-xs text-emerald-400">
                          {conversation.status}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-zinc-500">
                        {conversation.contact_phone}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="min-h-[650px] rounded-3xl border border-zinc-800 bg-[#111113]">
            {!selectedConversation ? (
              <div className="flex min-h-[650px] items-center justify-center text-zinc-500">
                Selecciona una conversación.
              </div>
            ) : (
              <>
                <header className="border-b border-zinc-800 p-6">
                  <h2 className="text-xl font-bold">
                    {selectedConversation.contact_name ||
                      selectedConversation.contact_phone}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {selectedConversation.contact_phone} ·{" "}
                    {selectedConversation.status}
                  </p>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px]">
                  <div className="border-r border-zinc-800">
                    <div className="max-h-[650px] space-y-4 overflow-y-auto p-6">
                      {messagesLoading ? (
                        <div className="py-10 text-center text-zinc-500">
                          Cargando mensajes...
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="py-10 text-center text-zinc-500">
                          No hay mensajes.
                        </div>
                      ) : (
                        messages.map((message) => {
                          const inbound =
                            message.direction === "inbound";

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                inbound
                                  ? "justify-start"
                                  : "justify-end"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                  inbound
                                    ? "bg-zinc-900 text-white"
                                    : "bg-blue-600 text-white"
                                }`}
                              >
                                <div className="whitespace-pre-wrap text-sm">
                                  {message.body}
                                </div>

                                <div className="mt-2 text-[11px] opacity-60">
                                  {new Date(
                                    message.created_at,
                                  ).toLocaleString("es-MX")}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <aside className="max-h-[650px] overflow-y-auto p-5">
                    <h3 className="mb-4 text-lg font-bold">
                      Estado comercial
                    </h3>

                    <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold">
                          Atención humana
                        </h4>

                        {handoffLoading ? (
                          <span className="text-xs text-zinc-500">
                            Cargando...
                          </span>
                        ) : handoff ? (
                          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                            {handoffStatusLabel(
                              handoff.status,
                            )}
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                            Sin handoff
                          </span>
                        )}
                      </div>

                      {handoff && (
                        <>
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {handoff.status === "pending" && (
                              <button
                                type="button"
                                disabled={
                                  handoffActionLoading
                                }
                                onClick={() =>
                                  executeHandoffAction(
                                    "assign",
                                  )
                                }
                                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                {handoffActionLoading
                                  ? "Procesando..."
                                  : "Asignarme"}
                              </button>
                            )}

                            {(handoff.status === "assigned" ||
                              handoff.status === "pending") && (
                              <button
                                type="button"
                                disabled={
                                  handoffActionLoading
                                }
                                onClick={() =>
                                  executeHandoffAction(
                                    "start",
                                  )
                                }
                                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                Iniciar atención
                              </button>
                            )}

                            {(handoff.status === "assigned" ||
                              handoff.status ===
                                "in_progress") && (
                              <button
                                type="button"
                                disabled={
                                  handoffActionLoading
                                }
                                onClick={() =>
                                  executeHandoffAction(
                                    "resolve",
                                  )
                                }
                                className="rounded-xl bg-zinc-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                              >
                                Resolver
                              </button>
                            )}

                            {(handoff.status === "pending" ||
                              handoff.status === "assigned" ||
                              handoff.status ===
                                "in_progress") && (
                              <button
                                type="button"
                                disabled={
                                  handoffActionLoading
                                }
                                onClick={() =>
                                  executeHandoffAction(
                                    "cancel",
                                  )
                                }
                                className="rounded-xl border border-red-900 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-300 disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            )}
                          </div>

                          <div className="mt-4 space-y-2 text-sm">
                            <div>
                              <span className="text-zinc-500">
                                Motivo:
                              </span>{" "}
                              {formatValue(
                                handoff.reason,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Intención:
                              </span>{" "}
                              {formatValue(
                                handoff.intent,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Confianza:
                              </span>{" "}
                              {handoff.confidence !==
                                null &&
                              handoff.confidence !==
                                undefined
                                ? `${Math.round(
                                    handoff.confidence * 100,
                                  )}%`
                                : "No registrada"}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Asignado a:
                              </span>{" "}
                              {formatValue(
                                handoff.assigned_to,
                              )}
                            </div>

                            {handoff.requested_at && (
                              <div>
                                <span className="text-zinc-500">
                                  Solicitud:
                                </span>{" "}
                                {new Date(
                                  handoff.requested_at,
                                ).toLocaleString(
                                  "es-MX",
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {commercialLoading ? (
                      <div className="py-8 text-center text-zinc-500">
                        Cargando estado comercial...
                      </div>
                    ) : !commercialState ? (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
                        No hay estado comercial registrado.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                            <div className="text-xs text-zinc-500">
                              Etapa
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatValue(
                                opportunity?.stage,
                              )}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                            <div className="text-xs text-zinc-500">
                              Interés
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatValue(
                                opportunity?.interestLevel,
                              )}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                            <div className="text-xs text-zinc-500">
                              Intención de compra
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatValue(
                                opportunity?.purchaseIntent,
                              )}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                            <div className="text-xs text-zinc-500">
                              Readiness
                            </div>
                            <div className="mt-1 font-semibold">
                              {formatValue(
                                opportunity?.readiness,
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">
                              Calificación
                            </span>

                            <span className="text-xl font-black">
                              {formatValue(
                                qualification?.qualificationScore,
                              )}
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-zinc-500">
                            Nivel:{" "}
                            {formatValue(
                              qualification?.level,
                            )}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                          <h4 className="font-semibold">
                            Datos comerciales
                          </h4>

                          <div className="mt-3 space-y-2 text-sm">
                            <div>
                              <span className="text-zinc-500">
                                Producto/servicio:
                              </span>{" "}
                              {formatValue(
                                commercial?.productOrService,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Tipo de cliente:
                              </span>{" "}
                              {formatValue(
                                commercial?.customerType,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Cantidad:
                              </span>{" "}
                              {formatValue(
                                commercial?.quantity,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Necesidad:
                              </span>{" "}
                              {formatValue(
                                commercial?.need,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Presupuesto:
                              </span>{" "}
                              {formatValue(
                                commercial?.budget,
                              )}
                            </div>

                            <div>
                              <span className="text-zinc-500">
                                Precio:
                              </span>{" "}
                              {formatValue(
                                commercial?.price,
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">
                              Objeciones
                            </h4>

                            <span className="text-sm text-zinc-400">
                              {formatValue(
                                objections?.count ?? 0,
                              )}
                            </span>
                          </div>

                          {objections?.objections?.length ? (
                            <div className="mt-3 space-y-2">
                              {objections.objections.map(
                                (
                                  objection,
                                  index,
                                ) => (
                                  <div
                                    key={`${objection.type}-${index}`}
                                    className="rounded-xl border border-zinc-800 p-3 text-sm"
                                  >
                                    <div className="font-semibold">
                                      {formatValue(
                                        objection.type,
                                      )}
                                    </div>

                                    <div className="mt-1 text-zinc-400">
                                      {formatValue(
                                        objection.text,
                                      )}
                                    </div>

                                    <div className="mt-2 text-xs text-zinc-500">
                                      Severidad:{" "}
                                      {formatValue(
                                        objection.severity,
                                      )}{" "}
                                      · Estado:{" "}
                                      {formatValue(
                                        objection.status,
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="mt-3 text-sm text-zinc-500">
                              Sin objeciones registradas.
                            </div>
                          )}
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                          <h4 className="font-semibold">
                            Información faltante
                          </h4>

                          {qualification
                            ?.missingInformation?.length ? (
                            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                              {qualification.missingInformation.map(
                                (item) => (
                                  <li key={item}>
                                    • {item}
                                  </li>
                                ),
                              )}
                            </ul>
                          ) : (
                            <div className="mt-3 text-sm text-zinc-500">
                              No hay información faltante
                              registrada.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </aside>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}