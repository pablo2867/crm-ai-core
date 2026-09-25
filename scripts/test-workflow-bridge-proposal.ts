import { config } from "dotenv";

config({ path: ".env.local" });



async function main() {
  const { bootKernel } = await import("../platform/kernel/boot");
  const { aiConversationWorkflowBridge } =
    await import("../platform/ai/conversation/workflow-bridge");
  bootKernel();

  console.log("");
  console.log("===== WORKFLOW BRIDGE → PROPOSAL TEST =====");
  console.log("");

  const result =
    await aiConversationWorkflowBridge.execute({
      userId: "5b44469c-4ad3-40c0-804a-3ae0cc053cd7",
      organizationId: "8bc86409-0d84-4427-b53f-1676021674cf",
      workspaceId: "6db85bca-3688-4eb4-adb8-2e94da18e88e",
      conversationId: "test-conversation",
      contactPhone: "+5219999999999",
      contactName: "Cliente de prueba",
      message:
        "Necesito cotización de 2 bidones de CLORO 20 LTS SILTEC ULTRA",
      limit: 20,
      context: {
        commercialData: {
          productOrService: "CLORO 20 LTS SILTEC ULTRA",
          customerType: "oficina",
          quantity: "2 BIDONES",
          need: "cotización del producto",
          requirements: [],
          objections: [],
        },
        customerName: "Cliente de prueba",
        commercialResult: null,
      },
    });

  console.log("");
  console.log("===== WORKFLOW BRIDGE RESULT =====");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("");
  console.error("===== WORKFLOW BRIDGE TEST ERROR =====");
  console.error(error);
  process.exit(1);
});


