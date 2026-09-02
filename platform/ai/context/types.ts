export interface AIContextLead {

  id: number;

  name: string;

  score: number;

  probability: number;

  revenue: number;

  temperature: string;

}

export interface AIContext {

  leads: AIContextLead[];

  bestLead?: AIContextLead;

  totalRevenue: number;

  hotLeads: number;

}