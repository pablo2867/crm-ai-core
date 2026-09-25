import { NextResponse } from "next/server";
import { ensureKernel } from "@/platform/kernel/ensure";
import twilio from "twilio";

import {
  whatsappConnectionService,
} from "@/platform/services/whatsapp-connections";

import {
  conversationService,
} from "@/platform/services/conversations";

import {
  conversationLifecycleService,
} from "@/platform/services/conversation-lifecycle";

import {
  aiConversationWorkflowBridge,
  commercialConversationIntelligence,
  deriveOpportunityState,
  analyzeObjections,
  analyzeQualification,
} from "@/platform/ai/conversation";

import {
  conversationCommercialStateService,
} from "@/platform/services/conversation-commercial-state";

import {
  conversationHandoffService,
} from "@/platform/services/conversation-handoff";

import {
  conversationMemoryEngine,
} from "@/platform/ai/conversation-memory";

import {
  sendWhatsAppMessage,
} from "@/platform/integrations/twilio/service";

function normalizeWhatsAppNumber(
  value: string,
): string {
  const trimmed = value.trim();

  if (trimmed.startsWith("whatsapp:")) {
    return trimmed;
  }

  return `whatsapp:${trimmed}`;
}

function getWebhookUrl(
  request: Request,
): string {
  const configured =
    process.env.TWILIO_WEBHOOK_URL?.trim();

  if (configured) {
    return configured;
  }

  return request.url;
}

async function validateTwilioSignature(
  request: Request,
  params: URLSearchParams,
): Promise<boolean> {

  const authToken =
    process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    throw new Error(
      "TWILIO_NOT_CONFIGURED",
    );
  }

  const signature =
    request.headers.get(
      "X-Twilio-Signature",
    );

  if (!signature) {
    return false;
  }

  const url =
    getWebhookUrl(request);

  const body:
    Record<string, string> = {};

  params.forEach(
    (value, key) => {
      body[key] = value;
    },
  );

  return twilio.validateRequest(
    authToken,
    signature,
    url,
    body,
  );
}

export async function POST(
  request: Request,
) {

  try {

    const rawBody =
      await request.text();

    const params =
      new URLSearchParams(
        rawBody,
      );

    const validSignature =
      await validateTwilioSignature(
        request,
        params,
      );

    if (!validSignature) {

      return new NextResponse(
        "INVALID_TWILIO_SIGNATURE",
        {
          status: 403,
        },
      );

    }

    ensureKernel();

    const fromRaw =
      params.get("From")?.trim() ??
      "";

    const toRaw =
      params.get("To")?.trim() ??
      "";

    const messageBody =
      params.get("Body")?.trim() ??
      "";

    const messageSid =
      params.get("MessageSid")?.trim() ??
      "";

    const profileName =
      params.get("ProfileName")?.trim() ??
      "";

    if (!fromRaw || !toRaw) {

      return new NextResponse(
        "FROM_AND_TO_REQUIRED",
        {
          status: 400,
        },
      );

    }

    const from =
      normalizeWhatsAppNumber(
        fromRaw,
      );

    const to =
      normalizeWhatsAppNumber(
        toRaw,
      );

    let connection =
      await whatsappConnectionService.findByPhone({
        phoneNumber: to,
      });

    if (!connection) {
      connection =
        await whatsappConnectionService.findByPhone({
          phoneNumber: from,
        });
    }

    if (!connection) {

      console.error(
        "WHATSAPP_CONNECTION_NOT_FOUND",
        {
          to,
          from,
        },
      );

      return new NextResponse(
        "WHATSAPP_CONNECTION_NOT_FOUND",
        {
          status: 404,
        },
      );

    }

    const conversation =
      await conversationService.createConversation({

        userId:
          connection.userId,

        organizationId:
          connection.organizationId,

        workspaceId:
          connection.workspaceId,

        channel:
          "whatsapp",

        contactPhone:
          from,

        contactName:
          profileName || null,

        status:
          "open",

      });

    let lifecycle;

    try {
      lifecycle =
        await conversationLifecycleService.get({
          conversationId: conversation.id,
          userId: connection.userId,
          organizationId: connection.organizationId,
          workspaceId: connection.workspaceId,
        });

      if (
        conversation.status !== "open" ||
        (lifecycle && lifecycle.status !== "open")
      ) {
        lifecycle =
          await conversationLifecycleService.reopen({
            conversationId: conversation.id,
            userId: connection.userId,
            organizationId: connection.organizationId,
            workspaceId: connection.workspaceId,
            reason: "inbound_message",
          });

        await conversationService.updateConversation({
          id: conversation.id,
          userId: connection.userId,
          organizationId: connection.organizationId,
          workspaceId: connection.workspaceId,
          values: {
            status: "open",
          },
        });

        console.log(
          "WHATSAPP_CONVERSATION_REOPENED",
          {
            conversationId: conversation.id,
            reason: "inbound_message",
          },
        );
      } else {
        lifecycle =
          await conversationLifecycleService.touch({
            conversationId: conversation.id,
            userId: connection.userId,
            organizationId: connection.organizationId,
            workspaceId: connection.workspaceId,
          });
      }
    } catch (lifecycleError) {
      console.error(
        "WHATSAPP_CONVERSATION_LIFECYCLE_ERROR:",
        lifecycleError,
      );
    }

    if (messageBody) {

      await conversationService.addMessage({

        userId:
          connection.userId,

        organizationId:
          connection.organizationId,

        workspaceId:
          connection.workspaceId,

        conversationId:
          conversation.id,

        direction:
          "inbound",

        body:
          messageBody,

        sender:
          from,

        recipient:
          to,

        provider:
          "twilio",

        providerMessageId:
          messageSid || null,

        status:
          "received",

        metadata: {

          profileName:
            profileName || null,

          messageSid:
            messageSid || null,

          rawFrom:
            fromRaw,

          rawTo:
            toRaw,

        },

      });

      try {
        await conversationLifecycleService.touch({
          conversationId: conversation.id,
          userId: connection.userId,
          organizationId: connection.organizationId,
          workspaceId: connection.workspaceId,
        });
      } catch (lifecycleError) {
        console.error(
          "WHATSAPP_CONVERSATION_LIFECYCLE_TOUCH_ERROR:",
          lifecycleError,
        );
      }


      let commercialResult: Awaited<
        ReturnType<typeof commercialConversationIntelligence.extract>
      > | null = null;

      try {
        commercialResult =
          await commercialConversationIntelligence.extract({
            userId: connection.userId,
            organizationId: connection.organizationId,
            workspaceId: connection.workspaceId,
            conversationId: conversation.id,
            contactPhone: from,
            contactName: profileName || null,
            message: messageBody,
            limit: 20,
          });

        if (commercialResult.success) {
          const opportunityState =
            deriveOpportunityState(commercialResult.data);

          const objections =
            analyzeObjections(commercialResult.data);

          const qualification =
            analyzeQualification(commercialResult.data);

          await conversationCommercialStateService.persist({
            userId: connection.userId,
            organizationId: connection.organizationId,
            workspaceId: connection.workspaceId,
            conversationId: conversation.id,
            commercialData: commercialResult.data,
            opportunityState,
            objections,
            qualification,
          });

          console.log(
            "WHATSAPP_COMMERCIAL_STATE_PERSISTED",
            {
              conversationId: conversation.id,
              stage: opportunityState.stage,
              qualificationLevel: qualification.level,
              qualificationScore: qualification.qualificationScore,
              objectionCount: objections.count,
            },
          );
        }
      } catch (commercialStateError) {
        console.error(
          "WHATSAPP_COMMERCIAL_STATE_ERROR:",
          commercialStateError,
        );
      }

      try {
        const memoryResult =
          await conversationMemoryEngine.build({
            userId: connection.userId,
            organizationId: connection.organizationId,
            workspaceId: connection.workspaceId,
            conversationId: conversation.id,
            limit: 50,
          });

        if (memoryResult.success) {
          console.log(
            "WHATSAPP_CONVERSATION_MEMORY_PERSISTED",
            {
              conversationId: conversation.id,
              messageCount: memoryResult.messageCount,
              facts: memoryResult.facts.length,
              preferences: memoryResult.preferences.length,
              decisions: memoryResult.decisions.length,
            },
          );
        } else {
          console.error(
            "WHATSAPP_CONVERSATION_MEMORY_ERROR:",
            memoryResult.error,
          );
        }
      } catch (memoryError) {
        console.error(
          "WHATSAPP_CONVERSATION_MEMORY_ERROR:",
          memoryError,
        );
      }
      console.log(
        "WHATSAPP_INBOUND_MESSAGE_SAVED",
        {
          conversationId:
            conversation.id,

          from,

          to,

          messageSid,
        },
      );

      try {

        const workflowResult =
          await aiConversationWorkflowBridge.execute({

            userId:
              connection.userId,

            organizationId:
              connection.organizationId,

            workspaceId:
              connection.workspaceId,

            conversationId:
              conversation.id,

            contactPhone:
              from,

            contactName:
              profileName || null,

            message:
              messageBody,

            limit:
              20,

            context: {
              commercialData:
                commercialResult?.success
            ? commercialResult.data
                  : null,

              customerName:
                profileName || null,

              commercialResult:
                commercialResult?.success
            ? commercialResult
                  : null,
            },

          });

        console.log(
          "WHATSAPP_WORKFLOW_RESULT",
          {
            conversationId:
              conversation.id,

            success:
              workflowResult.success,

            requiresHuman:
              workflowResult.requiresHuman,

            intent:
              workflowResult
                .conversationDecision
                .intent,

            confidence:
              workflowResult
                .conversationDecision
                .confidence,

            workflowId:
              workflowResult
                .workflow
                ?.workflowId ??
              null,
          },
        );

        if (
          workflowResult.requiresHuman
        ) {

          try {

            const handoff =
              await conversationHandoffService.request({
                userId:
                  connection.userId,

                organizationId:
                  connection.organizationId,

                workspaceId:
                  connection.workspaceId,

                conversationId:
                  conversation.id,

                reason:
                  workflowResult
                    .conversationDecision
                    .reason,

                intent:
                  workflowResult
                    .conversationDecision
                    .intent,

                confidence:
                  workflowResult
                    .conversationDecision
                    .confidence,

                metadata: {
                  source: "whatsapp_webhook",
                  messageSid:
                    messageSid || null,
                  contactPhone:
                    from,
                  contactName:
                    profileName || null,
                },
              });

            console.log(
              "WHATSAPP_HUMAN_HANDOFF",
              {
                conversationId:
                  conversation.id,

                handoffId:
                  handoff.id,

                status:
                  handoff.status,

                intent:
                  workflowResult
                    .conversationDecision
                    .intent,

                confidence:
                  workflowResult
                    .conversationDecision
                    .confidence,
              },
            );

            const humanResponse =
              "Claro. He solicitado que una persona de nuestro equipo te atienda. En breve continuaremos contigo.";

            const twilioResponse =
              await sendWhatsAppMessage({
                to: from,
                body: humanResponse,
              });

            const outboundMessage =
              await conversationService.addMessage({

                userId:
                  connection.userId,

                organizationId:
                  connection.organizationId,

                workspaceId:
                  connection.workspaceId,

                conversationId:
                  conversation.id,

                direction:
                  "outbound",

                body:
                  humanResponse,

                sender:
                  twilioResponse.from,

                recipient:
                  twilioResponse.to,

                provider:
                  "twilio",

                providerMessageId:
                  twilioResponse.sid,

                status:
                  twilioResponse.status ===
                    "queued" ||
                  twilioResponse.status ===
                    "sent" ||
                  twilioResponse.status ===
                    "delivered" ||
                  twilioResponse.status ===
                    "read" ||
                  twilioResponse.status ===
                    "failed"
                    ? twilioResponse.status
                    : "sent",

                metadata: {

                  twilio:
                    twilioResponse,

                  handoff: {

                    handoffId:
                      handoff.id,

                    status:
                      handoff.status,

                  },

                  ai: {

                    intent:
                      workflowResult
                        .conversationDecision
                        .intent,

                    confidence:
                      workflowResult
                        .conversationDecision
                        .confidence,

                  },

                },

              });

            console.log(
              "WHATSAPP_HUMAN_REPLY_SENT",
              {
                conversationId:
                  conversation.id,

                messageId:
                  outboundMessage.id,

                providerMessageId:
                  twilioResponse.sid,

                handoffId:
                  handoff.id,
              },
            );

            try {

              const memoryResult =
                await conversationMemoryEngine.build({
                  userId:
                    connection.userId,

                  organizationId:
                    connection.organizationId,

                  workspaceId:
                    connection.workspaceId,

                  conversationId:
                    conversation.id,

                  limit:
                    50,
                });

              if (memoryResult.success) {

                console.log(
                  "WHATSAPP_CONVERSATION_MEMORY_UPDATED",
                  {
                    conversationId:
                      conversation.id,

                    messageCount:
                      memoryResult.messageCount,

                    facts:
                      memoryResult.facts.length,

                    preferences:
                      memoryResult.preferences.length,

                    decisions:
                      memoryResult.decisions.length,
                  },
                );

              } else {

                console.error(
                  "WHATSAPP_CONVERSATION_MEMORY_UPDATE_ERROR:",
                  memoryResult.error,
                );

              }

            } catch (memoryUpdateError) {

              console.error(
                "WHATSAPP_CONVERSATION_MEMORY_UPDATE_ERROR:",
                memoryUpdateError,
              );

            }

          } catch (handoffError) {

            console.error(
              "WHATSAPP_HUMAN_HANDOFF_ERROR:",
              handoffError,
            );

          }

        } else if (
          workflowResult.success &&
          workflowResult.workflow
        ) {

          const generatedText =
            typeof workflowResult
              .workflow
              .context
              ?.text === "string"
              ? workflowResult
                  .workflow
                  .context
                  .text
                  .trim()
              : "";

          if (generatedText) {

            const twilioResponse =
              await sendWhatsAppMessage({
                to: from,
                body: generatedText,
              });

            const outboundMessage =
              await conversationService.addMessage({

                userId:
                  connection.userId,

                organizationId:
                  connection.organizationId,

                workspaceId:
                  connection.workspaceId,

                conversationId:
                  conversation.id,

                direction:
                  "outbound",

                body:
                  generatedText,

                sender:
                  twilioResponse.from,

                recipient:
                  twilioResponse.to,

                provider:
                  "twilio",

                providerMessageId:
                  twilioResponse.sid,

                status:
                  twilioResponse.status ===
                    "queued" ||
                  twilioResponse.status ===
                    "sent" ||
                  twilioResponse.status ===
                    "delivered" ||
                  twilioResponse.status ===
                    "read" ||
                  twilioResponse.status ===
                    "failed"
                    ? twilioResponse.status
                    : "sent",

                metadata: {

                  twilio:
                    twilioResponse,

                  ai: {

                    intent:
                      workflowResult
                        .conversationDecision
                        .intent,

                    confidence:
                      workflowResult
                        .conversationDecision
                        .confidence,

                  },

                  workflow: {

                    workflowId:
                      workflowResult
                        .workflow
                        .workflowId,

                  },

                },

              });

            console.log(
              "WHATSAPP_WORKFLOW_REPLY_SENT",
              {
                conversationId:
                  conversation.id,

                messageId:
                  outboundMessage.id,

                providerMessageId:
                  twilioResponse.sid,

                intent:
                  workflowResult
                    .conversationDecision
                    .intent,
              },
            );

            try {
              const memoryResult =
                await conversationMemoryEngine.build({
                  userId: connection.userId,
                  organizationId: connection.organizationId,
                  workspaceId: connection.workspaceId,
                  conversationId: conversation.id,
                  limit: 50,
                });

              if (memoryResult.success) {
                console.log(
                  "WHATSAPP_CONVERSATION_MEMORY_UPDATED",
                  {
                    conversationId: conversation.id,
                    messageCount: memoryResult.messageCount,
                    facts: memoryResult.facts.length,
                    preferences: memoryResult.preferences.length,
                    decisions: memoryResult.decisions.length,
                  },
                );
              } else {
                console.error(
                  "WHATSAPP_CONVERSATION_MEMORY_UPDATE_ERROR:",
                  memoryResult.error,
                );
              }
            } catch (memoryUpdateError) {
              console.error(
                "WHATSAPP_CONVERSATION_MEMORY_UPDATE_ERROR:",
                memoryUpdateError,
              );
            }

          } else {

            console.error(
              "WHATSAPP_WORKFLOW_RESPONSE_EMPTY",
              {
                conversationId:
                  conversation.id,

                workflowId:
                  workflowResult
                    .workflow
                    .workflowId,
              },
            );

          }

        } else {

          console.error(
            "WHATSAPP_WORKFLOW_FAILED",
            {
              conversationId:
                conversation.id,

              error:
                workflowResult.error ??
                "WHATSAPP_WORKFLOW_FAILED",
            },
          );

        }

      } catch (workflowError) {

        console.error(
          "WHATSAPP_WORKFLOW_ERROR:",
          workflowError,
        );

      }

    }

    return new NextResponse(
      "<Response></Response>",
      {
        status: 200,

        headers: {
          "Content-Type":
            "text/xml; charset=utf-8",
        },
      },
    );

  } catch (error) {

    console.error(
      "WHATSAPP_WEBHOOK_ERROR:",
      error,
    );

    const errorMessage =
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR";

    const status =
      errorMessage ===
      "TWILIO_NOT_CONFIGURED"
        ? 503
        : 500;

    return NextResponse.json(
      {
        success: false,
        error:
          errorMessage,
      },
      {
        status,
      },
    );

  }

}










