import {
  FinancialIntakeQuestion,
  FinancialIntakeState,
} from "./types";

const PRIORITY_SCORE: Record<
  FinancialIntakeQuestion["priority"],
  number
> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
};

export class FinancialQuestionEngine {
  getNextQuestion(
    state: FinancialIntakeState
  ): FinancialIntakeQuestion | undefined {
    const pendingQuestions =
      this.getPendingQuestions(state);

    if (pendingQuestions.length === 0) {
      return undefined;
    }

    return pendingQuestions
      .sort(
        (a, b) =>
          this.calculatePriorityScore(
            b,
            state
          ) -
          this.calculatePriorityScore(
            a,
            state
          )
      )[0];
  }

  getPendingQuestions(
    state: FinancialIntakeState
  ): FinancialIntakeQuestion[] {
    const blockedFields =
      this.getConfirmationFields(state);

    const answeredFields =
      this.getAnsweredFields(state);

    return state.questions.filter(
      (question) => {
        const isBlocked =
          blockedFields.has(
            question.field
          );

        const isAnswered =
          answeredFields.has(
            question.field
          );

        return (
          !isAnswered ||
          isBlocked
        );
      }
    );
  }

  shouldAskFollowUp(
    state: FinancialIntakeState
  ): boolean {
    return state.inconsistencies.some(
      (item) =>
        item.requiresConfirmation
    );
  }

  getConfirmationQuestions(
    state: FinancialIntakeState
  ): FinancialIntakeQuestion[] {
    const confirmationFields =
      this.getConfirmationFields(state);

    return state.questions.filter(
      (question) =>
        confirmationFields.has(
          question.field
        )
    );
  }

  private getAnsweredFields(
    state: FinancialIntakeState
  ): Set<string> {
    const answeredFields =
      new Set<string>();

    for (const answer of state.answers) {
      if (
        answer.interpretedValue ===
        undefined
      ) {
        continue;
      }

      answeredFields.add(
        answer.field
      );
    }

    return answeredFields;
  }

  private getConfirmationFields(
    state: FinancialIntakeState
  ): Set<string> {
    return new Set(
      state.inconsistencies
        .filter(
          (item) =>
            item.requiresConfirmation
        )
        .flatMap(
          (item) => item.fields
        )
    );
  }

  private calculatePriorityScore(
    question: FinancialIntakeQuestion,
    state: FinancialIntakeState
  ): number {
    let score =
      PRIORITY_SCORE[
        question.priority
      ];

    if (question.required) {
      score += 20;
    }

    const hasInconsistency =
      state.inconsistencies.some(
        (item) =>
          item.fields.includes(
            question.field
          )
      );

    if (hasInconsistency) {
      score += 50;
    }

    const requiresConfirmation =
      state.inconsistencies.some(
        (item) =>
          item.fields.includes(
            question.field
          ) &&
          item.requiresConfirmation
      );

    if (requiresConfirmation) {
      score += 100;
    }

    return score;
  }
}

export const financialQuestionEngine =
  new FinancialQuestionEngine();