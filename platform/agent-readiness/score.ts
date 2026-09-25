export const agentReadiness = {
  discoverability: true,
  agentLegibility: true,
  semanticStructure: true,
  structuredData: true,
  crawlerPolicy: true,
  productIdentity: true,
  publicInformation: true,
  agentInterface: true,
};

export function calculateAgentReadinessScore(): number {
  const checks = Object.values(agentReadiness);
  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}
