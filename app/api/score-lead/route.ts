import { NextResponse }
from "next/server";

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const lead =
      body.lead;

    if (!lead) {

      return NextResponse.json({

        temperature:
          "COLD",

        score:
          20,

      });

    }

    let score = 0;

    if (
      lead.email
    ) {
      score += 20;
    }

    if (
      lead.phone
    ) {
      score += 20;
    }

    if (
      lead.company
    ) {
      score += 15;
    }

    if (
      lead.message &&
      lead.message.length > 30
    ) {
      score += 25;
    }

    if (
      lead.status ===
      "Contactado"
    ) {
      score += 15;
    }

    if (
      lead.status ===
      "Cerrado"
    ) {
      score += 30;
    }

    let temperature =
      "COLD";

    if (score >= 80) {

      temperature =
        "HOT";

    } else if (
      score >= 50
    ) {

      temperature =
        "WARM";

    }

    return NextResponse.json({

      score,
      temperature,

    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({

      score: 0,

      temperature:
        "COLD",

    });

  }

}