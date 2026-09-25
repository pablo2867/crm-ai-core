import {
  FinancialIntakeMode,
  FinancialIntakeQuestion,
} from "./types";

export interface FinancialIntakeModeConfig {
  mode: FinancialIntakeMode;
  label: string;
  description: string;
  tone: "simple" | "technical";
  allowApproximateValues: boolean;
  requireConfirmationForExtractedData: boolean;
}

export const FINANCIAL_INTAKE_MODES: Record<
  FinancialIntakeMode,
  FinancialIntakeModeConfig
> = {
  owner: {
    mode: "owner",
    label: "Dueño del negocio",
    description:
      "Modo diseñado para propietarios o responsables del negocio que no necesariamente utilizan terminología contable.",
    tone: "simple",
    allowApproximateValues: true,
    requireConfirmationForExtractedData: true,
  },

  accountant: {
    mode: "accountant",
    label: "Contador",
    description:
      "Modo diseñado para usuarios con conocimientos contables y financieros.",
    tone: "technical",
    allowApproximateValues: false,
    requireConfirmationForExtractedData: true,
  },
};

export function getModeConfig(
  mode: FinancialIntakeMode
): FinancialIntakeModeConfig {
  return FINANCIAL_INTAKE_MODES[mode];
}

export function adaptQuestionToMode(
  question: FinancialIntakeQuestion,
  mode: FinancialIntakeMode
): FinancialIntakeQuestion {
  const config = getModeConfig(mode);

  if (config.tone === "technical") {
    return {
      ...question,
      question: toTechnicalQuestion(question),
    };
  }

  return {
    ...question,
    question: toOwnerQuestion(question),
  };
}

function toOwnerQuestion(
  question: FinancialIntakeQuestion
): string {
  const replacements: Record<string, string> = {
    revenue:
      "¿Cuánto dinero ingresó por las ventas de tu negocio durante ese período?",
    operating_expenses:
      "¿Cuánto gastó tu negocio para funcionar durante ese período?",
    cash:
      "¿Cuánto dinero tenía disponible el negocio al terminar ese período?",
    accounts_receivable:
      "¿Cuánto dinero te debían tus clientes al terminar ese período?",
    accounts_payable:
      "¿Cuánto dinero debía tu negocio a proveedores u otras personas?",
    debt:
      "¿Cuánto debía el negocio por préstamos u otras deudas?",
    inventory:
      "¿Cuánto valía aproximadamente la mercancía o inventario que tenías?",
    fixed_assets:
      "¿Cuánto valen aproximadamente los equipos, vehículos, maquinaria u otros bienes del negocio?",
    equity:
      "¿Cuánto dinero propio has invertido en el negocio?",
  };

  return replacements[question.field] ?? question.question;
}

function toTechnicalQuestion(
  question: FinancialIntakeQuestion
): string {
  const replacements: Record<string, string> = {
    revenue:
      "Indique los ingresos reconocidos correspondientes al período.",
    operating_expenses:
      "Indique los gastos operativos reconocidos durante el período.",
    cash:
      "Indique el saldo de efectivo y equivalentes al cierre del período.",
    accounts_receivable:
      "Indique el saldo de cuentas por cobrar al cierre.",
    accounts_payable:
      "Indique el saldo de cuentas por pagar al cierre.",
    debt:
      "Indique el saldo de obligaciones financieras pendientes al cierre.",
    inventory:
      "Indique el valor contable del inventario al cierre.",
    fixed_assets:
      "Indique el valor neto de propiedades, planta y equipo.",
    equity:
      "Indique el saldo del patrimonio o capital contable al cierre.",
  };

  return replacements[question.field] ?? question.question;
}