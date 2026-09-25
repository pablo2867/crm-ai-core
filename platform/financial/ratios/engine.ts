import type {
  FinancialAccount,
  FinancialTransaction,
} from "../types";

import type {
  FinancialRatioCategory,
  FinancialRatioRequest,
  FinancialRatioResult,
  FinancialRatiosResult,
  FinancialRatioType,
} from "./types";

export class FinancialRatiosEngine {
  calculate(
    request: FinancialRatioRequest,
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
  ): FinancialRatiosResult {
    const filteredTransactions =
      this.filterTransactions(
        transactions,
        request,
      );

    const revenue =
      this.sumByType(
        filteredTransactions,
        "revenue",
      );

    const expenses =
      this.sumByType(
        filteredTransactions,
        "expense",
      );

    const assets =
      this.sumByType(
        filteredTransactions,
        "asset",
      );

    const liabilities =
      this.sumByType(
        filteredTransactions,
        "liability",
      );

    const equity =
      this.sumByType(
        filteredTransactions,
        "equity",
      );

    const costOfSales =
      this.sumClassifiedExpenses(
        filteredTransactions,
        accounts,
        request.costAccountCodes,
        request.costAccountKeywords,
      );

    const operatingExpenses =
      this.sumClassifiedExpenses(
        filteredTransactions,
        accounts,
        request.operatingExpenseAccountCodes,
        request.operatingExpenseAccountKeywords,
      );

    const classifiedExpenses =
      costOfSales + operatingExpenses;

    const unclassifiedExpenses =
      Math.max(
        0,
        expenses - classifiedExpenses,
      );

    const effectiveOperatingExpenses =
      operatingExpenses +
      unclassifiedExpenses;

    const grossProfit =
      revenue - costOfSales;

    const operatingProfit =
      grossProfit -
      effectiveOperatingExpenses;

    const netProfit =
      revenue - expenses;

    const currentAssets =
      this.sumClassifiedTransactions(
        filteredTransactions,
        accounts,
        "asset",
        request.currentAssetAccountCodes,
        request.currentAssetAccountKeywords,
      );

    const liquidAssets =
      this.sumClassifiedTransactions(
        filteredTransactions,
        accounts,
        "asset",
        request.liquidAssetAccountCodes,
        request.liquidAssetAccountKeywords,
      );

    const inventory =
      this.sumClassifiedTransactions(
        filteredTransactions,
        accounts,
        "asset",
        request.inventoryAccountCodes,
        request.inventoryAccountKeywords,
      );

    const currentLiabilities =
      this.sumClassifiedTransactions(
        filteredTransactions,
        accounts,
        "liability",
        request.currentLiabilityAccountCodes,
        request.currentLiabilityAccountKeywords,
      );

    const ratioTypes =
      request.ratioTypes ??
      [
        "current_ratio",
        "quick_ratio",
        "debt_ratio",
        "debt_to_equity",
        "gross_margin",
        "operating_margin",
        "net_margin",
        "roa",
        "roe",
        "asset_turnover",
      ];

    const values = {
      revenue,
      expenses,
      assets,
      liabilities,
      equity,
      costOfSales,
      grossProfit,
      operatingExpenses:
        effectiveOperatingExpenses,
      operatingProfit,
      netProfit,
      currentAssets,
      liquidAssets,
      inventory,
      currentLiabilities,
    };

    const ratios = ratioTypes.map(
      (type) =>
        this.calculateRatio(
          type,
          values,
        ),
    );

    return {
      context: request.context,
      periodId: request.periodId,
      ratios,
    };
  }

  private calculateRatio(
    type: FinancialRatioType,
    values: {
      revenue: number;
      expenses: number;
      assets: number;
      liabilities: number;
      equity: number;
      costOfSales: number;
      grossProfit: number;
      operatingExpenses: number;
      operatingProfit: number;
      netProfit: number;
      currentAssets: number;
      liquidAssets: number;
      inventory: number;
      currentLiabilities: number;
    },
  ): FinancialRatioResult {
    let value: number | null = null;

    let unit:
      | "ratio"
      | "percentage" = "ratio";

    switch (type) {
      case "current_ratio":
        value = this.safeDivide(
          values.currentAssets,
          values.currentLiabilities,
        );
        break;

      case "quick_ratio":
        value = this.safeDivide(
          values.liquidAssets -
            values.inventory,
          values.currentLiabilities,
        );
        break;

      case "debt_ratio":
        value = this.safeDivide(
          values.liabilities,
          values.assets,
        );
        break;

      case "debt_to_equity":
        value = this.safeDivide(
          values.liabilities,
          values.equity,
        );
        break;

      case "gross_margin":
        value = this.safeDivide(
          values.grossProfit,
          values.revenue,
        );
        unit = "percentage";
        break;

      case "operating_margin":
        value = this.safeDivide(
          values.operatingProfit,
          values.revenue,
        );
        unit = "percentage";
        break;

      case "net_margin":
        value = this.safeDivide(
          values.netProfit,
          values.revenue,
        );
        unit = "percentage";
        break;

      case "roa":
        value = this.safeDivide(
          values.netProfit,
          values.assets,
        );
        unit = "percentage";
        break;

      case "roe":
        value = this.safeDivide(
          values.netProfit,
          values.equity,
        );
        unit = "percentage";
        break;

      case "asset_turnover":
        value = this.safeDivide(
          values.revenue,
          values.assets,
        );
        break;
    }

    return {
      type,
      category:
        this.getCategory(type),
      value,
      unit,
    };
  }

  private filterTransactions(
    transactions: FinancialTransaction[],
    request: FinancialRatioRequest,
  ): FinancialTransaction[] {
    return transactions.filter(
      (transaction) => {
        if (
          transaction.organizationId !==
            request.context.organizationId ||
          transaction.workspaceId !==
            request.context.workspaceId
        ) {
          return false;
        }

        if (
          request.classification &&
          transaction.classification !==
            request.classification
        ) {
          return false;
        }

        return true;
      },
    );
  }

  private sumByType(
    transactions: FinancialTransaction[],
    type: FinancialTransaction["type"],
  ): number {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === type,
      )
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );
  }

  private sumClassifiedExpenses(
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
    accountCodes?: string[],
    keywords?: string[],
  ): number {
    return this.sumClassifiedTransactions(
      transactions,
      accounts,
      "expense",
      accountCodes,
      keywords,
    );
  }

  private sumClassifiedTransactions(
    transactions: FinancialTransaction[],
    accounts: FinancialAccount[],
    type: FinancialTransaction["type"],
    accountCodes?: string[],
    keywords?: string[],
  ): number {
    const normalizedCodes =
      (accountCodes ?? [])
        .map((code) =>
          code.trim().toLowerCase(),
        )
        .filter(Boolean);

    const normalizedKeywords =
      (keywords ?? [])
        .map((keyword) =>
          keyword.trim().toLowerCase(),
        )
        .filter(Boolean);

    if (
      normalizedCodes.length === 0 &&
      normalizedKeywords.length === 0
    ) {
      return 0;
    }

    const accountMap = new Map(
      accounts
        .filter(
          (account) =>
            account.id !== undefined,
        )
        .map((account) => [
          account.id as string,
          account,
        ]),
    );

    return transactions
      .filter(
        (transaction) =>
          transaction.type === type,
      )
      .filter((transaction) => {
        const account =
          accountMap.get(
            transaction.accountId,
          );

        if (!account) {
          return false;
        }

        const code =
          account.code.toLowerCase();

        const name =
          account.name.toLowerCase();

        if (
          normalizedCodes.includes(code)
        ) {
          return true;
        }

        return normalizedKeywords.some(
          (keyword) =>
            code.includes(keyword) ||
            name.includes(keyword),
        );
      })
      .reduce(
        (total, transaction) =>
          total + transaction.amount,
        0,
      );
  }

  private getCategory(
    type: FinancialRatioType,
  ): FinancialRatioCategory {
    switch (type) {
      case "current_ratio":
      case "quick_ratio":
        return "liquidity";

      case "debt_ratio":
      case "debt_to_equity":
        return "leverage";

      case "gross_margin":
      case "operating_margin":
      case "net_margin":
      case "roa":
      case "roe":
        return "profitability";

      case "asset_turnover":
        return "operating";
    }
  }

  private safeDivide(
    numerator: number,
    denominator: number,
  ): number | null {
    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }

    return numerator / denominator;
  }
}

export const financialRatiosEngine =
  new FinancialRatiosEngine();
