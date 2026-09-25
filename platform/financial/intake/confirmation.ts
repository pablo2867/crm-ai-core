import {
  FinancialExtractedData,
  FinancialIntakeState,
} from "./types";

export type FinancialConfirmationUse =
  | "latest"
  | "previous";

export interface FinancialConfirmationItem {
  field: string;
  description: string;
  latestValue: unknown;
  previousValue?: unknown;
  requiresConfirmation: boolean;
}

export interface FinancialConfirmationResult {
  state: FinancialIntakeState;
  confirmed: boolean;
  field: string;
  value?: unknown;
}

export class FinancialHumanConfirmation {
  getPendingItems(
    state: FinancialIntakeState
  ): FinancialConfirmationItem[] {
    const items: FinancialConfirmationItem[] = [];

    const confirmationInconsistencies =
      state.inconsistencies.filter(
        (item) =>
          item.requiresConfirmation
      );

    for (const inconsistency of confirmationInconsistencies) {
      for (const field of inconsistency.fields) {
        const fieldData =
          state.extractedData.filter(
            (item) =>
              item.field === field
          );

        if (fieldData.length === 0) {
          continue;
        }

        const latest =
          fieldData[fieldData.length - 1];

        const previous =
          fieldData.length > 1
            ? fieldData[
                fieldData.length - 2
              ]
            : undefined;

        items.push({
          field,
          description:
            inconsistency.description,
          latestValue:
            latest.value,
          previousValue:
            previous?.value,
          requiresConfirmation: true,
        });
      }
    }

    return items;
  }

  confirm(
    state: FinancialIntakeState,
    field: string,
    use: FinancialConfirmationUse = "latest"
  ): FinancialConfirmationResult {
    const result =
      this.applyConfirmation(
        state,
        field,
        true,
        use
      );

    return {
      state: result,
      confirmed: true,
      field,
      value:
        this.getSelectedValue(
          result,
          field
        ),
    };
  }

  reject(
    state: FinancialIntakeState,
    field: string,
    use: FinancialConfirmationUse = "latest"
  ): FinancialConfirmationResult {
    const result =
      this.applyConfirmation(
        state,
        field,
        false,
        use
      );

    return {
      state: result,
      confirmed: false,
      field,
      value:
        this.getSelectedValue(
          result,
          field
        ),
    };
  }

  applyConfirmation(
    state: FinancialIntakeState,
    field: string,
    confirmed: boolean,
    use: FinancialConfirmationUse = "latest"
  ): FinancialIntakeState {
    const fieldData =
      state.extractedData.filter(
        (item) =>
          item.field === field
      );

    if (fieldData.length === 0) {
      return state;
    }

    const selectedIndex =
      use === "previous" &&
      fieldData.length > 1
        ? fieldData.length - 2
        : fieldData.length - 1;

    const selectedData =
      fieldData[selectedIndex];

    if (!selectedData) {
      return state;
    }

    const fieldAnswers =
      state.answers.filter(
        (answer) =>
          answer.field === field &&
          answer.interpretedValue !==
            undefined
      );

    const selectedAnswer =
      fieldAnswers[
        Math.min(
          selectedIndex,
          fieldAnswers.length - 1
        )
      ];

    const updatedAnswer =
      selectedAnswer
        ? {
            ...selectedAnswer,
            confirmed,
          }
        : undefined;

    const updatedAnswers = [
      ...state.answers.filter(
        (answer) =>
          answer.field !== field
      ),
      ...(updatedAnswer
        ? [updatedAnswer]
        : []),
    ];

    const updatedData: FinancialExtractedData =
      {
        ...selectedData,
        confirmed,
      };

    const updatedExtractedData = [
      ...state.extractedData.filter(
        (item) =>
          item.field !== field
      ),
      updatedData,
    ];

    const updatedInconsistencies =
      confirmed
        ? state.inconsistencies.filter(
            (item) =>
              !item.fields.includes(
                field
              )
          )
        : state.inconsistencies;

    const hasPendingConfirmation =
      updatedInconsistencies.some(
        (item) =>
          item.requiresConfirmation
      );

    return {
      ...state,
      answers: updatedAnswers,
      extractedData:
        updatedExtractedData,
      inconsistencies:
        updatedInconsistencies,
      status:
        hasPendingConfirmation
          ? "needs_confirmation"
          : "in_progress",
      canContinueToAnalysis: false,
    };
  }

  hasPendingConfirmation(
    state: FinancialIntakeState
  ): boolean {
    return state.inconsistencies.some(
      (item) =>
        item.requiresConfirmation
    );
  }

  getSelectedValue(
    state: FinancialIntakeState,
    field: string
  ): unknown {
    const values =
      state.extractedData.filter(
        (item) =>
          item.field === field
      );

    return values.length > 0
      ? values[
          values.length - 1
        ].value
      : undefined;
  }
}

export const financialHumanConfirmation =
  new FinancialHumanConfirmation();