import {
  NextResponse,
} from "next/server";

import {
  actionService,
} from "@/platform/services/actions";

import {
  authEngine,
} from "@/platform/auth";

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const user =
      await authEngine.getUser();

    const tenant =
      await authEngine.getTenant();

    const result =
      await actionService.execute({

        action:
          body.action,

        userId:
          user.id,

        organizationId:
          tenant.organizationId,

        workspaceId:
          tenant.workspaceId,

        leadId:
          body.leadId,

        payload:
          body.payload,

      });

    return NextResponse.json({

      success: true,

      result,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {

        success: false,

        error:
          "Error ejecutando acciÃ³n.",

      },

      {

        status: 500,

      }

    );

  }

}


