import type {
  ExecutiveMemoryRecord,
} from "./types";

export class ExecutiveMemorySummarizer {

  summarize(
    records: ExecutiveMemoryRecord[]
  ): string {

    if (records.length === 0) {

      return "No existe memoria ejecutiva.";

    }

    const latest =
      records[0];

    return [
      `Registros: ${records.length}`,
      `Último workflow: ${latest.workflow ?? "N/A"}`,
      `Última skill: ${latest.skill ?? "N/A"}`,
      `Último resumen: ${latest.summary}`,
      latest.recommendation
        ? `Recomendación: ${latest.recommendation}`
        : undefined,
    ]
      .filter(Boolean)
      .join("\n");

  }

}

export const executiveMemorySummarizer =
  new ExecutiveMemorySummarizer();
