import {
  FinancialExtractedData,
  FinancialIntakeState,
} from "./types";

export interface FinancialMappedData {
  field: string;
  value: unknown;
  source: FinancialExtractedData["source"];
  confidence: number;
  confirmed: boolean;
}

export interface FinancialDataMappingResult {
  mappedData: FinancialMappedData[];
  confirmedData: FinancialMappedData[];
  pendingConfirmation: FinancialMappedData[];
  unmappedFields: string[];
}

interface FinancialAccountConfig {
  code: string;
  name: string;
  type:
    | "asset"
    | "liability"
    | "equity"
    | "revenue"
    | "expense";
}

const FIELD_ACCOUNT_CONFIG: Record<
  string,
  FinancialAccountConfig
> = {
  revenue: {
    code: "4000",
    name: "Ventas",
    type: "revenue",
  },

  operating_expenses: {
    code: "5000",
    name: "Gastos Operativos",
    type: "expense",
  },

  cash: {
    code: "1000",
    name: "Efectivo",
    type: "asset",
  },

  accounts_receivable: {
    code: "1100",
    name: "Cuentas por Cobrar",
    type: "asset",
  },

  inventory: {
    code: "1200",
    name: "Inventario",
    type: "asset",
  },

  fixed_assets: {
    code: "1500",
    name: "Activos Fijos",
    type: "asset",
  },

  accounts_payable: {
    code: "2000",
    name: "Cuentas por Pagar",
    type: "liability",
  },

  debt: {
    code: "2100",
    name: "Deuda Financiera",
    type: "liability",
  },

  equity: {
    code: "3000",
    name: "Capital",
    type: "equity",
  },
};

export class FinancialDataMapper {
  map(
    state: FinancialIntakeState
  ): FinancialDataMappingResult {
    const activeData =
      this.getActiveData(state);

    const mappedData: FinancialMappedData[] =
      [];

    const unmappedFields: string[] = [];

    const requiresHumanConfirmation =
      state.inconsistencies.some(
        (item) =>
          item.requiresConfirmation
      );

    for (const item of activeData) {
      const account =
        FIELD_ACCOUNT_CONFIG[item.field];

      if (!account) {
        unmappedFields.push(item.field);
        continue;
      }

      const confirmed =
        item.confirmed ||
        (
          state.status === "complete" &&
          state.informationStatus === "sufficient" &&
          state.canContinueToAnalysis &&
          !requiresHumanConfirmation
        );

      mappedData.push({
        field: item.field,
        value: item.value,
        source: item.source,
        confidence: item.confidence,
        confirmed,
      });
    }

    const confirmedData =
      mappedData.filter(
        (item) => item.confirmed
      );

    const pendingConfirmation =
      mappedData.filter(
        (item) => !item.confirmed
      );

    return {
      mappedData,
      confirmedData,
      pendingConfirmation,
      unmappedFields,
    };
  }

  mapConfirmedData(
    state: FinancialIntakeState
  ): FinancialMappedData[] {
    return this.map(state).confirmedData;
  }

  mapToTransactions(
    state: FinancialIntakeState
  ) {
    const confirmedData =
      this.mapConfirmedData(state);

    return confirmedData
      .filter((item) =>
        [
          "revenue",
          "operating_expenses",
        ].includes(item.field)
      )
      .map((item) => {
        const account =
          FIELD_ACCOUNT_CONFIG[
            item.field
          ];

        if (!account) {
          return undefined;
        }

        const amount =
          this.toNumber(item.value);

        if (amount === undefined) {
          return undefined;
        }

        return {
          account_code: account.code,
          account_name: account.name,
          type: account.type,
          amount,
          source: item.source,
          confidence: item.confidence,
          confirmed: item.confirmed,
        };
      })
      .filter(
        (
          transaction
        ): transaction is NonNullable<
          typeof transaction
        > =>
          transaction !== undefined
      );
  }

  getValue(
    state: FinancialIntakeState,
    field: string
  ): unknown {
    const activeData =
      this.getActiveData(state);

    const item =
      activeData.find(
        (data) =>
          data.field === field
      );

    return item?.value;
  }

  hasConfirmedField(
    state: FinancialIntakeState,
    field: string
  ): boolean {
    return this.map(state).confirmedData.some(
      (item) =>
        item.field === field
    );
  }

  hasField(
    state: FinancialIntakeState,
    field: string
  ): boolean {
    return this.getActiveData(
      state
    ).some(
      (item) =>
        item.field === field
    );
  }

  getAccountConfig(
    field: string
  ): FinancialAccountConfig | undefined {
    return FIELD_ACCOUNT_CONFIG[
      field
    ];
  }

  private getActiveData(
    state: FinancialIntakeState
  ): FinancialExtractedData[] {
    const fields = new Set(
      state.extractedData.map(
        (item) => item.field
      )
    );

    const result: FinancialExtractedData[] =
      [];

    for (const field of fields) {
      const fieldData =
        state.extractedData.filter(
          (item) =>
            item.field === field
        );

      if (fieldData.length === 0) {
        continue;
      }

      const requiresConfirmation =
        state.inconsistencies.some(
          (item) =>
            item.requiresConfirmation &&
            item.fields.includes(field)
        );

      if (requiresConfirmation) {
        result.push(
          fieldData[
            fieldData.length - 1
          ]
        );

        continue;
      }

      const confirmedData =
        fieldData.filter(
          (item) => item.confirmed
        );

      if (confirmedData.length > 0) {
        result.push(
          confirmedData[
            confirmedData.length - 1
          ]
        );

        continue;
      }

      result.push(
        fieldData[
          fieldData.length - 1
        ]
      );
    }

    return result;
  }

  private toNumber(
    value: unknown
  ): number | undefined {
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value !== "string"
    ) {
      return undefined;
    }

    const normalized =
      value
        .trim()
        .replace(
          /[$€£¥]/g,
          ""
        )
        .replace(
          /\b(MXN|USD|EUR|GBP)\b/gi,
          ""
        )
        .replace(
          /\s/g,
          ""
        )
        .replace(
          /,/g,
          ""
        );

    if (!normalized) {
      return undefined;
    }

    const parsed =
      Number(normalized);

    return Number.isFinite(parsed)
      ? parsed
      : undefined;
  }
}

export const financialDataMapper =
  new FinancialDataMapper();
