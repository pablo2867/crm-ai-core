import {
  getAllSkills,
} from "@/platform/skills";

import {
  agentRegistry,
} from "@/platform/agents/registry";

import type {
  MarketplaceCatalog,
  MarketplaceItem,
} from "./types";

function normalizeTags(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (tag): tag is string =>
      typeof tag === "string"
  );
}

function buildSkillItems(): MarketplaceItem[] {
  return getAllSkills().map(
    (skill) => ({
      id: skill.id,
      type: "skill",
      name: skill.name,
      description: skill.description,
      version: "1.0.0",
      category: "core",
      tags: ["skill", "core"],
      enabled: true,
      installed: true,
      capabilities: [],
    })
  );
}

function buildAgentItems(): MarketplaceItem[] {
  return agentRegistry
    .getAll()
    .map((agent) => {

      const metadata =
        agent.metadata;

      return {
        id: agent.id,
        type: "agent",
        name: agent.name,
        description:
          metadata?.description ??
          `AI Agent: ${agent.name}`,
        version:
          metadata?.version ??
          "1.0.0",
        category:
          metadata?.category ??
          "core",
        tags:
          normalizeTags(
            metadata?.tags
          ),
        enabled:
          metadata?.enabled ??
          true,
        installed: true,
        capabilities:
          (metadata?.capabilities ?? [])
            .map(
              (capability) =>
                capability.id
            ),
      };
    });
}

export class MarketplaceService {

  getCatalog(): MarketplaceCatalog {

    const skills =
      buildSkillItems();

    const agents =
      buildAgentItems();

    const items = [
      ...skills,
      ...agents,
    ];

    return {
      items,
      total: items.length,
      skills: skills.length,
      agents: agents.length,
    };
  }

  getItem(
    id: string
  ): MarketplaceItem | undefined {

    return this
      .getCatalog()
      .items
      .find(
        (item) =>
          item.id === id
      );
  }

}

export const marketplaceService =
  new MarketplaceService();
