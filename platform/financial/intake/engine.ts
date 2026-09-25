import {
  FinancialInformationStatus,
  FinancialIntakeQuestion,
  FinancialIntakeRequest,
  FinancialIntakeResponse,
  FinancialIntakeState,
} from "./types";

const QUESTION_PRIORITY_ORDER: Record<
  FinancialIntakeQuestion["priority"],
  number
> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export class FinancialIntakeEngine {
  initialize(
    mode: FinancialIntakeState["mode"]
  ): FinancialIntakeState {
    const questions = this.buildInitialQuestions(mode);

    return {
      status: "in_progress",
      informationStatus: "insufficient",
      mode,
      currentQuestion: this.selectNextQuestion(
        questions,
        [],
        []
      ),
      questions,
      answers: [],
      extractedData: [],
      missingFields: questions
        .filter((question) => question.required)
        .map((question) => question.field),
      inconsistencies: [],
      completionPercentage: 0,
      canContinueToAnalysis: false,
    };
  }

  evaluate(
    request: FinancialIntakeRequest
  ): FinancialIntakeResponse {
    const state =
      request.state ??
      this.initialize(request.mode);

    const missingFields =
      this.calculateMissingFields(state);

    const completionPercentage =
      this.calculateCompletionPercentage(state);

    const informationStatus =
      this.determineInformationStatus(
        state,
        missingFields
      );

    const requiresConfirmation =
      state.inconsistencies.some(
        (item) => item.requiresConfirmation
      );

    const canContinueToAnalysis =
      informationStatus === "sufficient" &&
      !requiresConfirmation;

    const status =
      requiresConfirmation
        ? "needs_confirmation"
        : canContinueToAnalysis
          ? "complete"
          : "in_progress";

    const nextQuestion =
      canContinueToAnalysis
        ? undefined
        : this.selectNextQuestion(
            state.questions,
            state.answers,
            state.inconsistencies
          );

    return {
      status,
      informationStatus,
      nextQuestion,
      extractedData: state.extractedData,
      missingFields,
      inconsistencies: state.inconsistencies,
      requiresConfirmation,
      canContinueToAnalysis,
      completionPercentage,
    };
  }

  getNextQuestion(
    state: FinancialIntakeState
  ): FinancialIntakeQuestion | undefined {
    return this.selectNextQuestion(
      state.questions,
      state.answers,
      state.inconsistencies
    );
  }

  private buildInitialQuestions(
    mode: FinancialIntakeState["mode"]
  ): FinancialIntakeQuestion[] {
    const ownerQuestions: FinancialIntakeQuestion[] = [
      {
        id: "financial_period",
        field: "financial_period",
        question:
          "¿De qué período quieres hacer el diagnóstico financiero?",
        type: "date",
        priority: "critical",
        required: true,
        reason:
          "Necesitamos determinar el período de análisis.",
      },
      {
        id: "revenue",
        field: "revenue",
        question:
          "¿Cuánto vendió o ingresó tu negocio durante ese período?",
        type: "currency",
        priority: "critical",
        required: true,
        reason:
          "Necesitamos los ingresos para calcular rentabilidad.",
      },
      {
        id: "operating_expenses",
        field: "operating_expenses",
        question:
          "¿Cuánto gastó aproximadamente tu negocio en gastos operativos?",
        type: "currency",
        priority: "critical",
        required: true,
        reason:
          "Necesitamos los gastos para determinar la utilidad.",
      },
      {
        id: "cash",
        field: "cash",
        question:
          "¿Cuánto dinero tenía disponible el negocio al cierre del período?",
        type: "currency",
        priority: "high",
        required: true,
        reason:
          "El efectivo es necesario para evaluar la posición financiera.",
      },
      {
        id: "accounts_receivable",
        field: "accounts_receivable",
        question:
          "¿Cuánto te deben tus clientes actualmente?",
        type: "currency",
        priority: "high",
        required: true,
        reason:
          "Las cuentas por cobrar ayudan a determinar la liquidez.",
      },
      {
        id: "accounts_payable",
        field: "accounts_payable",
        question:
          "¿Cuánto le debe actualmente el negocio a proveedores u otros acreedores?",
        type: "currency",
        priority: "high",
        required: true,
        reason:
          "Las cuentas por pagar son necesarias para evaluar obligaciones.",
      },
      {
        id: "debt",
        field: "debt",
        question:
          "¿Tiene el negocio préstamos o deudas pendientes? Si sí, ¿por cuánto?",
        type: "currency",
        priority: "high",
        required: true,
        reason:
          "La deuda es necesaria para evaluar solvencia.",
      },
      {
        id: "inventory",
        field: "inventory",
        question:
          "¿Cuál es aproximadamente el valor del inventario del negocio?",
        type: "currency",
        priority: "medium",
        required: false,
        reason:
          "El inventario permite mejorar el cálculo de activos.",
      },
      {
        id: "fixed_assets",
        field: "fixed_assets",
        question:
          "¿Cuál es aproximadamente el valor de equipos, maquinaria, vehículos u otros activos del negocio?",
        type: "currency",
        priority: "medium",
        required: false,
        reason:
          "Los activos fijos ayudan a completar el balance general.",
      },
      {
        id: "equity",
        field: "equity",
        question:
          "¿Cuánto capital propio has aportado al negocio aproximadamente?",
        type: "currency",
        priority: "medium",
        required: false,
        reason:
          "El capital ayuda a completar la estructura patrimonial.",
      },
    ];

    const accountantQuestions: FinancialIntakeQuestion[] = [
      {
        id: "financial_period",
        field: "financial_period",
        question:
          "Indique el período contable objeto del análisis.",
        type: "date",
        priority: "critical",
        required: true,
      },
      {
        id: "revenue",
        field: "revenue",
        question:
          "Indique los ingresos reconocidos correspondientes al período.",
        type: "currency",
        priority: "critical",
        required: true,
      },
      {
        id: "operating_expenses",
        field: "operating_expenses",
        question:
          "Indique los gastos operativos reconocidos durante el período.",
        type: "currency",
        priority: "critical",
        required: true,
      },
      {
        id: "cash",
        field: "cash",
        question:
          "Indique el saldo de efectivo y equivalentes al cierre.",
        type: "currency",
        priority: "high",
        required: true,
      },
      {
        id: "accounts_receivable",
        field: "accounts_receivable",
        question:
          "Indique el saldo de cuentas por cobrar al cierre.",
        type: "currency",
        priority: "high",
        required: true,
      },
      {
        id: "accounts_payable",
        field: "accounts_payable",
        question:
          "Indique el saldo de cuentas por pagar al cierre.",
        type: "currency",
        priority: "high",
        required: true,
      },
      {
        id: "debt",
        field: "debt",
        question:
          "Indique el saldo de deuda financiera pendiente al cierre.",
        type: "currency",
        priority: "high",
        required: true,
      },
      {
        id: "inventory",
        field: "inventory",
        question:
          "Indique el valor contable del inventario al cierre.",
        type: "currency",
        priority: "medium",
        required: false,
      },
      {
        id: "fixed_assets",
        field: "fixed_assets",
        question:
          "Indique el valor neto de propiedades, planta y equipo.",
        type: "currency",
        priority: "medium",
        required: false,
      },
      {
        id: "equity",
        field: "equity",
        question:
          "Indique el patrimonio o capital contable al cierre.",
        type: "currency",
        priority: "medium",
        required: false,
      },
    ];

    return mode === "accountant"
      ? accountantQuestions
      : ownerQuestions;
  }

  /**
   * A field is considered active when it has a valid interpreted value
   * and is not blocked by a confirmation-required inconsistency.
   *
   * Confirmation is not required for every normal answer.
   * It is required when the state explicitly contains an inconsistency
   * that requires human confirmation.
   */
  private getActiveFields(
    answers: FinancialIntakeState["answers"],
    inconsistencies: FinancialIntakeState["inconsistencies"]
  ): Set<string> {
    const blockedFields = new Set(
      inconsistencies
        .filter(
          (item) => item.requiresConfirmation
        )
        .flatMap((item) => item.fields)
    );

    const activeFields = new Set<string>();

    for (const answer of answers) {
      if (
        answer.interpretedValue === undefined
      ) {
        continue;
      }

      if (blockedFields.has(answer.field)) {
        continue;
      }

      activeFields.add(answer.field);
    }

    return activeFields;
  }

  private getBlockedFields(
    inconsistencies: FinancialIntakeState["inconsistencies"]
  ): Set<string> {
    return new Set(
      inconsistencies
        .filter(
          (item) => item.requiresConfirmation
        )
        .flatMap((item) => item.fields)
    );
  }

  private selectNextQuestion(
    questions: FinancialIntakeQuestion[],
    answers: FinancialIntakeState["answers"],
    inconsistencies: FinancialIntakeState["inconsistencies"]
  ): FinancialIntakeQuestion | undefined {
    const activeFields =
      this.getActiveFields(
        answers,
        inconsistencies
      );

    const blockedFields =
      this.getBlockedFields(
        inconsistencies
      );

    return [...questions]
      .filter((question) => {
        const active =
          activeFields.has(question.field);

        const blocked =
          blockedFields.has(question.field);

        return !active || blocked;
      })
      .sort(
        (a, b) =>
          QUESTION_PRIORITY_ORDER[
            a.priority
          ] -
          QUESTION_PRIORITY_ORDER[
            b.priority
          ]
      )[0];
  }

  private calculateMissingFields(
    state: FinancialIntakeState
  ): string[] {
    const activeFields =
      this.getActiveFields(
        state.answers,
        state.inconsistencies
      );

    const blockedFields =
      this.getBlockedFields(
        state.inconsistencies
      );

    return state.questions
      .filter(
        (question) =>
          question.required &&
          (
            !activeFields.has(
              question.field
            ) ||
            blockedFields.has(
              question.field
            )
          )
      )
      .map(
        (question) =>
          question.field
      );
  }

  private calculateCompletionPercentage(
    state: FinancialIntakeState
  ): number {
    const requiredQuestions =
      state.questions.filter(
        (question) => question.required
      );

    if (requiredQuestions.length === 0) {
      return 100;
    }

    const activeFields =
      this.getActiveFields(
        state.answers,
        state.inconsistencies
      );

    const blockedFields =
      this.getBlockedFields(
        state.inconsistencies
      );

    const answeredRequired =
      requiredQuestions.filter(
        (question) =>
          activeFields.has(
            question.field
          ) &&
          !blockedFields.has(
            question.field
          )
      );

    return Math.round(
      (answeredRequired.length /
        requiredQuestions.length) *
        100
    );
  }

  private determineInformationStatus(
    state: FinancialIntakeState,
    missingFields: string[]
  ): FinancialInformationStatus {
    const hasConfirmationRequired =
      state.inconsistencies.some(
        (item) => item.requiresConfirmation
      );

    if (hasConfirmationRequired) {
      return "inconsistent";
    }

    if (missingFields.length > 0) {
      return "insufficient";
    }

    return "sufficient";
  }
}

export const financialIntakeEngine =
  new FinancialIntakeEngine();