import type {
  FinancialAccount,
  FinancialDataContext,
  FinancialDataRepository,
  FinancialPeriod,
  FinancialStatement,
  FinancialTransaction,
  FinancialDataServiceContract,
  FinancialDataSourceRecord,
} from "./types";
import { FinancialRepository } from "./repository";

export class FinancialDataService implements FinancialDataServiceContract {
  constructor(
    private readonly repository: FinancialDataRepository = new FinancialRepository(),
  ) {}

  getPeriods(
    context: FinancialDataContext,
  ): Promise<FinancialPeriod[]> {
    return this.repository.getPeriods(context);
  }

  getAccounts(
    context: FinancialDataContext,
  ): Promise<FinancialAccount[]> {
    return this.repository.getAccounts(context);
  }

  getTransactions(
    context: FinancialDataContext,
    periodId?: string,
  ): Promise<FinancialTransaction[]> {
    return this.repository.getTransactions(context, periodId);
  }

  getStatements(
    context: FinancialDataContext,
    periodId?: string,
  ): Promise<FinancialStatement[]> {
    return this.repository.getStatements(context, periodId);
  }

  getSources(
    context: FinancialDataContext,
  ): Promise<FinancialDataSourceRecord[]> {
    return this.repository.getSources(context);
  }
}
