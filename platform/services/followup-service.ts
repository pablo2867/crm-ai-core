import {
  aiGateway,
} from "@/platform/ai/gateway";

interface FollowupInput {

  name: string;

  company?: string;

  email?: string;

}

function normalizeText(
  value: string
): string {

  return value
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\*\*/g, "")
    .replace(/["“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();

}

function countWords(
  value: string
): number {

  return value
    .split(/\s+/)
    .filter(Boolean)
    .length;

}

function hasUnsupportedCommercialClaim(
  text: string
): boolean {

  const normalized =
    text.toLowerCase();

  const forbiddenPatterns = [

    /\b\d+\s*%/,
    /\bdescuento\b/,
    /\bpromoci[oó]n\b/,
    /\boferta\b/,
    /\bprecio\b/,
    /\bcosto\b/,
    /\bgratis\b/,
    /\bregalo\b/,
    /\bbonificaci[oó]n\b/,
    /\bbeneficio exclusivo\b/,
    /\bprecio especial\b/,
    /\boferta exclusiva\b/,
    /\bdescuento exclusivo\b/,
    /\bsegunda unidad\b/,

  ];

  return forbiddenPatterns.some(
    pattern =>
      pattern.test(normalized)
  );

}

function hasUnsupportedContext(
  text: string
): boolean {

  const normalized =
    text.toLowerCase();

  const unsupportedPatterns = [

    /\bproyecto\b/,
    /\breuni[oó]n\b/,
    /\boportunidad\b/,
    /\bcontacto\b/,
    /\bdecisi[oó]n\b/,
    /\bnegociaci[oó]n\b/,
    /\bpropuesta\b/,
    /\bcotizaci[oó]n\b/,
    /\bpedido\b/,
    /\bcompra\b/,
    /\bcontrato\b/,
    /\bfecha\b/,
    /\bllamada\b/,
    /\bconversaci[oó]n\b/,

  ];

  return unsupportedPatterns.some(
    pattern =>
      pattern.test(normalized)
  );

}

function ensureExactClientName(
  text: string,
  name: string
): string {

  const cleanName =
    normalizeText(name);

  if (!cleanName) {
    return text;
  }

  const parts =
    cleanName.split(/\s+/);

  if (parts.length < 2) {
    return text;
  }

  const firstName =
    parts[0];

  const firstNameRegex =
    new RegExp(
      `\\b${firstName}\\b`,
      "i"
    );

  if (
    firstNameRegex.test(text) &&
    !text.toLowerCase().includes(
      cleanName.toLowerCase()
    )
  ) {

    return normalizeText(
      text.replace(
        firstNameRegex,
        cleanName
      )
    );

  }

  return text;

}

function containsClientName(
  text: string,
  name: string
): boolean {

  const normalizedText =
    text.toLowerCase();

  const normalizedName =
    name
      .trim()
      .toLowerCase();

  if (!normalizedName) {
    return false;
  }

  return normalizedText.includes(
    normalizedName
  );

}

function isValidFollowup(
  text: string,
  name: string
): boolean {

  const normalized =
    normalizeText(text);

  if (!normalized) {
    return false;
  }

  if (
    countWords(normalized) > 15
  ) {
    return false;
  }

  if (
    normalized.includes("?") ||
    normalized.includes("¿")
  ) {
    return false;
  }

  const sentenceCount =
    normalized
      .split(/[.!?]+/)
      .map(
        sentence =>
          sentence.trim()
      )
      .filter(Boolean)
      .length;

  if (
    sentenceCount > 1
  ) {
    return false;
  }

  if (
    hasUnsupportedCommercialClaim(
      normalized
    )
  ) {
    return false;
  }

  if (
    hasUnsupportedContext(
      normalized
    )
  ) {
    return false;
  }

  if (
    !containsClientName(
      normalized,
      name
    )
  ) {
    return false;
  }

  return true;

}

function buildFallback(
  name: string
): string {

  const cleanName =
    normalizeText(name) ||
    "cliente";

  return normalizeText(
    `${cleanName}, seguimos disponibles para ayudarte cuando gustes.`
  );

}

export async function generateFollowup(
  input: FollowupInput
): Promise<string> {

  const safeName =
    normalizeText(input.name) ||
    "Cliente";

  const safeCompany =
    normalizeText(
      input.company ?? ""
    ) ||
    "No especificada";

  const prompt = `
Eres un SDR profesional.

Genera un único follow-up comercial en español.

Nombre: ${safeName}
Empresa: ${safeCompany}

Reglas:
- máximo 12 palabras
- una sola frase
- sin preguntas
- sin emojis
- sin firma
- usa exactamente el nombre completo
- no inventes información
- mensaje genérico y profesional

Devuelve únicamente el mensaje.
`;

  const response =
    await aiGateway.generate({

      prompt,

      temperature: 0,

      numPredict: 12,

    });

  let text =
    normalizeText(
      response.text || ""
    );

  text =
    ensureExactClientName(
      text,
      safeName
    );

  if (
    response.success &&
    isValidFollowup(
      text,
      safeName
    )
  ) {

    return text;

  }

  return buildFallback(
    safeName
  );

}
