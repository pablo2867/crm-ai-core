import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { bootKernel } = await import("../platform/kernel/boot");
  const { aiConversationWorkflowBridge } =
    await import("../platform/ai/conversation/workflow-bridge");

  bootKernel();

  const result = await aiConversationWorkflowBridge.execute({
    userId: "5b44469c-4ad3-40c0-804a-3ae0cc053cd7",
    organizationId: "8bc86409-0d84-4427-b53f-1676021674cf",
    workspaceId: "6db85bca-3688-4eb4-adb8-2e94da18e88e",

    message:
      "Necesito cotización de 2 bidones de CLORO 20 LTS SILTEC ULTRA",

    conversationId: "99d26c64-f652-4ffc-a6a5-f8ad43eb0453",
    contactPhone: "+5219999999999",
    contactName: "Cliente E2E",

    context: {
      commercialData: {
        productOrService: "CLORO 20 LTS SILTEC ULTRA",
        customerType: "oficina",
        quantity: "2 BIDONES",
        need: "cotización del producto",
        requirements: [],
        objections: [],
      },

      customerName: "Cliente E2E",
    },
  });

  console.log("");
  console.log("===== E2E PROPOSAL RESULT =====");

  console.log(
    JSON.stringify(
      {
        success: result.success,
        workflowId: result.workflow?.workflowId,
        intent: result.conversationDecision?.intent,
        generatedText:
          typeof result.workflow?.context?.text === "string"
            ? result.workflow.context.text
            : null,
        proposal: {
          success: result.workflow?.context?.success,
          reason: result.workflow?.context?.reason,
          productName: result.workflow?.context?.productName,
          quantity: result.workflow?.context?.quantity,
          unitPrice: result.workflow?.context?.unitPrice,
          subtotal: result.workflow?.context?.subtotal,
          currency: result.workflow?.context?.currency,
          unit: result.workflow?.context?.unit,
          imageUrl: result.workflow?.context?.imageUrl,
        },
      },
      null,
      2,
    ),
  );

  console.log("");
  console.log("===== E2E ASSERTIONS =====");

  const checks = [
    ["workflow", result.workflow?.workflowId === "whatsapp-proposal"],
    ["intent", result.conversationDecision?.intent === "whatsapp.proposal"],
    ["success", result.success === true],
    ["proposal", result.workflow?.context?.reason === "proposal_ready"],
    [
      "product",
      result.workflow?.context?.productName ===
        "CLORO 20 LTS SILTEC ULTRA",
    ],
    ["quantity", result.workflow?.context?.quantity === 2],
    ["unitPrice", result.workflow?.context?.unitPrice === 211.81],
    ["subtotal", result.workflow?.context?.subtotal === 423.62],
    ["currency", result.workflow?.context?.currency === "MXN"],
    [
      "text",
      typeof result.workflow?.context?.text === "string" &&
        result.workflow.context.text.length > 0,
    ],
  ];

  let failed = false;

  for (const [name, passed] of checks) {
    console.log(`${passed ? "PASS" : "FAIL"}: ${name}`);

    if (!passed) {
      failed = true;
    }
  }

  if (failed) {
    throw new Error("E2E_PROPOSAL_ASSERTION_FAILED");
  }

  console.log("");
  console.log("===== E2E PROPOSAL TEST PASSED =====");
}

main().catch((error) => {
  console.error("");
  console.error("===== E2E PROPOSAL TEST FAILED =====");
  console.error(error);
  process.exit(1);
});
