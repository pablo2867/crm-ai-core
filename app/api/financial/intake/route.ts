import { NextRequest, NextResponse } from "next/server";

import {
  financialIntakeService,
} from "@/platform/financial/intake";

import type {
  FinancialIntakeMode,
  FinancialIntakeState,
} from "@/platform/financial/intake/types";

type FinancialConfirmationUse =
  | "latest"
  | "previous";

interface FinancialIntakeBody {
  userId?: string;
  mode?: FinancialIntakeMode;
  message?: string;
  state?: FinancialIntakeState;

  action?: "confirm" | "reject";
  field?: string;
  use?: FinancialConfirmationUse;
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as FinancialIntakeBody;

    if (
      body.mode !== "owner" &&
      body.mode !== "accountant"
    ) {
      return NextResponse.json(
        {
          error:
            'El campo "mode" debe ser "owner" o "accountant".',
        },
        { status: 400 }
      );
    }

    if (body.action) {
      if (!body.state) {
        return NextResponse.json(
          {
            error:
              'El campo "state" es obligatorio para una acción de confirmación.',
          },
          { status: 400 }
        );
      }

      if (!body.field) {
        return NextResponse.json(
          {
            error:
              'El campo "field" es obligatorio para una acción de confirmación.',
          },
          { status: 400 }
        );
      }

      const use =
        body.use ?? "latest";

      if (
        use !== "latest" &&
        use !== "previous"
      ) {
        return NextResponse.json(
          {
            error:
              'El campo "use" debe ser "latest" o "previous".',
          },
          { status: 400 }
        );
      }

      let state: FinancialIntakeState;

      if (body.action === "confirm") {
        state =
          financialIntakeService.confirmField(
            body.state,
            body.field,
            use
          );
      } else {
        state =
          financialIntakeService.rejectField(
            body.state,
            body.field,
            use
          );
      }

      const mapping =
        financialIntakeService.mapData(state);

      const confirmationRequired =
        financialIntakeService.requiresConfirmation(
          state
        );

      return NextResponse.json({
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
        mapping,
      });
    }

    const result =
      await financialIntakeService.process({
        userId: body.userId,
        mode: body.mode,
        message: body.message,
        state: body.state,
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Financial Intake API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No fue posible procesar la entrevista financiera.",
      },
      { status: 500 }
    );
  }
}