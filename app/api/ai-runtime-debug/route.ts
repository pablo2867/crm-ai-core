import {
  NextResponse,
} from "next/server";

import {
  bootKernel,
} from "@/platform/kernel/boot";

import {
  moduleManager,
} from "@/platform/modules";

import {
  capabilityProvider,
} from "@/platform/capability-provider";

export async function GET() {

  bootKernel();

  const modules =
    moduleManager.getModules();

  const capabilities =
    capabilityProvider.getAll();

  return NextResponse.json({

    modules:
      modules.map(
        module => ({
          id: module.id,
          name: module.name,
          enabled: module.enabled,
          runtimeCapabilities:
            module.runtimeCapabilities.map(
              capability =>
                capability.id
            ),
        })
      ),

    capabilities:
      capabilities.map(
        capability =>
          capability.id
      ),

    commandCenter:
      capabilityProvider.get(
        "command-center"
      )
        ? "FOUND"
        : "NOT_FOUND",

  });

}
