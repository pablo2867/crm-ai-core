import type {
  FinancialBudgetLine,
  FinancialBudgetRequest,
  FinancialBudgetResult,
} from "./types";

export class FinancialBudgetEngine {
  calculate(
    request: FinancialBudgetRequest,
  ): FinancialBudgetResult {
    const revenue = this.sumByType(
      request.lines,
      "revenue",
    );

    const expenses = this.sumByType(
      request.lines,
      "expense",
    );

    const profit = revenue - expenses;

    const currency =
      request.lines[0]?.currency ?? "USD";

    return {
      context: request.context,
      periodId: request.periodId,
      revenue,
      expenses,
      profit,
      currency,
      lines: request.lines,
    };
  }

  private sumByType(
    lines: FinancialBudgetLine[],
    type: FinancialBudgetLine["type"],
  ): number {
    return lines
      .filter((line) => line.type === type)
      .reduce(
        (total, line) => total + line.amount,
        0,
      );
  }
}

export const financialBudgetEngine =
  new FinancialBudgetEngine();