import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "CRM AI CORE",
    version: "1.0.0",
    description:
      "Public agent interface for discovering CRM AI CORE product capabilities.",
    capabilities: [
      "lead-management",
      "sales",
      "follow-up",
      "automation",
      "artificial-intelligence",
      "analytics",
    ],
    resources: {
      website: "/",
      features: "/features",
      solutions: "/solutions",
      demo: "/demo",
      pricing: "/pricing",
      documentation: "/documentation",
      faq: "/faq",
      aiPolicy: "/ai-policy",
      llms: "/llms.txt",
      agentInterface: "/agent-interface.md",
    },
    authentication: {
      required: false,
      scope: "public-discovery-only",
    },
    policy:
      "Private CRM operations require authentication and authorization.",
  });
}
