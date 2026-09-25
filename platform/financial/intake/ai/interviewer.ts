import {
  FinancialExtractedData,
  FinancialInconsistency,
  FinancialIntakeAnswer,
  FinancialIntakeQuestion,
  FinancialIntakeState,
} from "../types";

export interface FinancialInterviewResult {
  answer: FinancialIntakeAnswer;
  extractedData: FinancialExtractedData[];
  inconsistencies: FinancialInconsistency[];
  clarificationRequired: boolean;
  clarificationQuestion?: string;
}

export class FinancialAIInterviewer {
  interpretAnswer(
    question: FinancialIntakeQuestion,
    rawAnswer: string
  ): FinancialInterviewResult {
    const normalizedAnswer = rawAnswer.trim();

    if (!normalizedAnswer) {
      return {
        answer: {
          questionId: question.id,
          field: question.field,
          rawAnswer,
          confirmed: false,
        },
        extractedData: [],
        inconsistencies: [],
        clarificationRequired: true,
        clarificationQuestion:
          "Necesito una respuesta para poder continuar. Â¿Puedes proporcionar ese dato?",
      };
    }

    const interpretedValue = this.parseValue(
      question,
      normalizedAnswer
    );

    if (interpretedValue === undefined) {
      return {
        answer: {
          questionId: question.id,
          field: question.field,
          rawAnswer,
          confirmed: false,
        },
        extractedData: [],
        inconsistencies: [],
        clarificationRequired: true,
        clarificationQuestion:
          this.buildClarificationQuestion(question),
      };
    }

    const confidence =
      this.calculateConfidence(
        question,
        normalizedAnswer,
        interpretedValue
      );

    const extractedData: FinancialExtractedData[] = [
      {
        field: question.field,
        value: interpretedValue,
        source: "user",
        confidence,
        confirmed: false,
      },
    ];

    return {
      answer: {
        questionId: question.id,
        field: question.field,
        rawAnswer,
        interpretedValue,
        confidence,
        confirmed: false,
      },
      extractedData,
      inconsistencies: [],
      clarificationRequired: false,
    };
  }

  validateAgainstState(
    result: FinancialInterviewResult,
    state: FinancialIntakeState
  ): FinancialInconsistency[] {
    const inconsistencies: FinancialInconsistency[] = [];

    const value = result.answer.interpretedValue;

    if (
      typeof value === "number" &&
      value < 0 &&
      this.isNonNegativeField(
        result.answer.field
      )
    ) {
      inconsistencies.push({
        id: `negative-${result.answer.field}`,
        fields: [result.answer.field],
        description:
          `El valor indicado para ${result.answer.field} no puede interpretarse como un valor negativo en este contexto.`,
        severity: "medium",
        requiresConfirmation: true,
      });
    }

    const previousValue =
      state.extractedData.find(
        (item) =>
          item.field === result.answer.field
      );

    if (
      previousValue &&
      typeof previousValue.value === "number" &&
      typeof value === "number" &&
      previousValue.value !== value
    ) {
      inconsistencies.push({
        id: `changed-${result.answer.field}`,
        fields: [result.answer.field],
        description:
          `El valor proporcionado anteriormente para ${result.answer.field} es diferente al nuevo valor.`,
        severity: "high",
        requiresConfirmation: true,
      });
    }

    return inconsistencies;
  }

  decideContinuation(
    state: FinancialIntakeState
  ): "continue" | "confirm" | "complete" {
    if (
      state.inconsistencies.some(
        (item) => item.requiresConfirmation
      )
    ) {
      return "confirm";
    }

    if (
      state.missingFields.length === 0 &&
      state.informationStatus === "sufficient"
    ) {
      return "complete";
    }

    return "continue";
  }

  private parseValue(
    question: FinancialIntakeQuestion,
    answer: string
  ): unknown {
    switch (question.type) {
      case "currency":
      case "number":
      case "percentage":
        return this.parseNumber(answer);

      case "boolean":
        return this.parseBoolean(answer);

      case "date":
        return this.parseDate(answer);

      case "choice":
      case "multi_choice":
      case "text":
        return answer;

      default:
        return undefined;
    }
  }

  private parseNumber(
    value: string
  ): number | undefined {
    const normalized = value
      .toLowerCase()
      .replace(/\$/g, "")
      .replace(/mxn/gi, "")
      .replace(/usd/gi, "")
      .replace(/pesos?/gi, "")
      .replace(/d[oÃ³]lares?/gi, "")
      .replace(/,/g, "")
      .replace(/%/g, "")
      .trim();

    const match = normalized.match(
      /-?\d+(?:\.\d+)?/
    );

    if (!match) {
      return undefined;
    }

    const number = Number(match[0]);

    return Number.isFinite(number)
      ? number
      : undefined;
  }

  private parseBoolean(
    value: string
  ): boolean | undefined {
    const normalized = value
      .trim()
      .toLowerCase();

    if (
      ["sÃ­", "si", "yes", "true", "1"].includes(
        normalized
      )
    ) {
      return true;
    }

    if (
      ["no", "false", "0"].includes(
        normalized
      )
    ) {
      return false;
    }

    return undefined;
  }

  private parseDate(
    value: string
  ): string | undefined {
    const normalized = value.trim();

    if (
      !/^\d{4}[-\/]\d{1,2}[-\/]\d{1,2}$/.test(normalized) &&
      !/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(normalized)
    ) {
      return undefined;
    }

    const timestamp = Date.parse(normalized);

    if (Number.isNaN(timestamp)) {
      return undefined;
    }

    return new Date(timestamp)
      .toISOString()
      .split("T")[0];
  }
  private calculateConfidence(
    question: FinancialIntakeQuestion,
    rawAnswer: string,
    interpretedValue: unknown
  ): number {
    if (!rawAnswer.trim()) {
      return 0;
    }

    if (
      question.type === "currency" ||
      question.type === "number" ||
      question.type === "percentage"
    ) {
      return typeof interpretedValue === "number"
        ? 0.95
        : 0;
    }

    if (
      question.type === "boolean" ||
      question.type === "date"
    ) {
      return interpretedValue !== undefined
        ? 0.95
        : 0;
    }

    return 0.85;
  }

  private buildClarificationQuestion(
    question: FinancialIntakeQuestion
  ): string {
    switch (question.type) {
      case "currency":
        return `Â¿Puedes indicar el monto de "${question.question}" en pesos mexicanos?`;

      case "number":
        return `Â¿Puedes proporcionar un nÃºmero para "${question.question}"?`;

      case "percentage":
        return `Â¿Puedes indicar el porcentaje correspondiente a "${question.question}"?`;

      case "date":
        return "Â¿Puedes indicar la fecha o perÃ­odo con mayor precisiÃ³n?";

      case "boolean":
        return "Â¿La respuesta es sÃ­ o no?";

      default:
        return `Â¿Puedes aclarar tu respuesta a esta pregunta: "${question.question}"?`;
    }
  }

  private isNonNegativeField(
    field: string
  ): boolean {
    return [
      "revenue",
      "operating_expenses",
      "cash",
      "accounts_receivable",
      "accounts_payable",
      "debt",
      "inventory",
      "fixed_assets",
      "equity",
    ].includes(field);
  }
}

export const financialAIInterviewer =
  new FinancialAIInterviewer();

