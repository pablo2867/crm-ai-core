import { financialIntakeEngine } from "./engine";
import { financialQuestionEngine } from "./question-engine";
import { financialHumanConfirmation } from "./confirmation";
import { financialDataMapper } from "./data-mapping";
import { financialAIInterviewer } from "./ai/interviewer";

import type {
  FinancialIntakeMode,
  FinancialIntakeRequest,
  FinancialIntakeState,
} from "./types";

import type {
  FinancialConfirmationUse,
} from "./confirmation";

export class FinancialIntakeService {
  initialize(
    mode: FinancialIntakeMode
  ): FinancialIntakeState {
    return financialIntakeEngine.initialize(mode);
  }

  evaluate(request: FinancialIntakeRequest) {
    return financialIntakeEngine.evaluate(request);
  }

  async process(request: FinancialIntakeRequest) {
    let state =
      request.state ??
      this.initialize(request.mode);

    let interview;

    if (
      request.message &&
      state.currentQuestion
    ) {
      interview =
        await financialAIInterviewer.interpretAnswer(
          state.currentQuestion,
          request.message,
        );

      const inconsistencies =
        financialAIInterviewer.validateAgainstState(
          interview,
          state
        );

      state = {
        ...state,

        answers: [
          ...state.answers,
          interview.answer,
        ],

        extractedData: [
          ...state.extractedData,
          ...interview.extractedData,
        ],

        inconsistencies: [
          ...state.inconsistencies,
          ...inconsistencies,
          ...interview.inconsistencies,
        ],
      };
    }

    const evaluation =
      financialIntakeEngine.evaluate({
        ...request,
        state,
      });

    state = {
      ...state,

      status: evaluation.status,

      informationStatus:
        evaluation.informationStatus,

      currentQuestion:
        evaluation.nextQuestion,

      missingFields:
        evaluation.missingFields,

      inconsistencies:
        evaluation.inconsistencies,

      completionPercentage:
        evaluation.completionPercentage,

      canContinueToAnalysis:
        evaluation.canContinueToAnalysis,
    };

    const pendingConfirmationItems =
      financialHumanConfirmation.getPendingItems(
        state
      );

    const confirmationRequired =
      pendingConfirmationItems.length > 0;

    if (confirmationRequired) {
      state = {
        ...state,
        status: "needs_confirmation",
        canContinueToAnalysis: false,
      };
    }

    const mapping =
      financialDataMapper.map(state);

    return {
      status: state.status,

      informationStatus:
        state.informationStatus,

      nextQuestion:
        state.currentQuestion,

      extractedData:
        state.extractedData,

      missingFields:
        state.missingFields,

      inconsistencies:
        state.inconsistencies,

      requiresConfirmation:
        confirmationRequired,

      canContinueToAnalysis:
        state.canContinueToAnalysis &&
        !confirmationRequired,

      completionPercentage:
        state.completionPercentage,

      state,

      interview,

      mapping,
    };
  }

  getNextQuestion(
    state: FinancialIntakeState
  ) {
    return financialQuestionEngine.getNextQuestion(
      state
    );
  }

  getPendingQuestions(
    state: FinancialIntakeState
  ) {
    return financialQuestionEngine.getPendingQuestions(
      state
    );
  }

  requiresConfirmation(
    state: FinancialIntakeState
  ): boolean {
    return (
      financialHumanConfirmation.getPendingItems(
        state
      ).length > 0
    );
  }

  getPendingConfirmationItems(
    state: FinancialIntakeState
  ) {
    return financialHumanConfirmation.getPendingItems(
      state
    );
  }

  confirmField(
    state: FinancialIntakeState,
    field: string,
    use: FinancialConfirmationUse = "latest"
  ): FinancialIntakeState {
    return financialHumanConfirmation.applyConfirmation(
      state,
      field,
      true,
      use
    );
  }

  rejectField(
    state: FinancialIntakeState,
    field: string,
    use: FinancialConfirmationUse = "latest"
  ): FinancialIntakeState {
    return financialHumanConfirmation.applyConfirmation(
      state,
      field,
      false,
      use
    );
  }

  mapData(
    state: FinancialIntakeState
  ) {
    return financialDataMapper.map(state);
  }
}

export const financialIntakeService =
  new FinancialIntakeService();

