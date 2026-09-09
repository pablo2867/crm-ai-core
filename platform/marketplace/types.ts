export type MarketplaceItemType =
  | "skill"
  | "agent";

export interface MarketplaceItem {
  id: string;
  type: MarketplaceItemType;
  name: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  enabled: boolean;
  installed: boolean;
  capabilities: string[];
}

export interface MarketplaceCatalog {
  items: MarketplaceItem[];
  total: number;
  skills: number;
  agents: number;
}
