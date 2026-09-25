import type {
  FinancialCopilotRequest,
  FinancialCopilotResult,
} from "./types";

import { financialCopilotEngine } from "./engine";

export class FinancialCopilotService {
  async execute(
    request: FinancialCopilotRequest,
  ): Promise<FinancialCopilotResult> {
    return financialCopilotEngine.execute(
      request,
    );
  }
}

export const financialCopilotService =
  new FinancialCopilotService();