import { bootKernel } from "../platform/kernel/boot";
import { workflowEngine } from "../platform/workflows/engine";
import { whatsappProposalWorkflow } from "../platform/workflows/definitions/whatsapp/proposal";

async function main() {
  bootKernel();

  const context = {
    userId: "5b44469c-4ad3-40c0-804a-3ae0cc053cd7",
    organizationId: "8bc86409-0d84-4427-b53f-1676021674cf",
    workspaceId: "6db85bca-3688-4eb4-adb8-2e94da18e88e",
    intent: "whatsapp.proposal",
    message: "Necesito cotización de 2 bidones de CLORO 20 LTS SILTEC ULTRA",
    customerName: "Cliente de prueba",
    commercialData: {
      productOrService: "CLORO 20 LTS SILTEC ULTRA",
      customerType: "oficina",
      quantity: "2 BIDONES",
      need: "cotización del producto",
      requirements: [],
      objections: [],
    },
  };

  console.log("");
  console.log("===== WORKFLOW EXECUTOR TEST =====");
  console.log("Workflow:", whatsappProposalWorkflow.id);
  console.log("");

  const result = await workflowEngine.execute(
    whatsappProposalWorkflow,
    context,
  );

  console.log("");
  console.log("===== WORKFLOW RESULT =====");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error("");
  console.error("===== WORKFLOW TEST ERROR =====");
  console.error(error);
  process.exit(1);
});

