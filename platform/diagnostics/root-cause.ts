import type {
  DiagnosticIssue,
} from "./types";

export interface RootCauseAnalysis {

  issueId: string;

  rootCause: string;

  impact: string;

  confidence: number;

  evidenceCount: number;

}

export class RootCauseAnalyzer {

  analyze(
    issue: DiagnosticIssue
  ): RootCauseAnalysis {

    const rootCause =
      issue.rootCause ??
      issue.description;

    const impact =
      issue.affectedComponents.length > 0
        ? `Afecta: ${issue.affectedComponents.join(", ")}.`
        : "No se identificaron componentes afectados.";

    const evidenceCount =
      issue.evidence.length;

    const confidence =
      issue.rootCause
        ? 1
        : evidenceCount > 0
          ? 0.8
          : 0.5;

    return {

      issueId:
        issue.id,

      rootCause,

      impact,

      confidence,

      evidenceCount,

    };

  }

  analyzeAll(
    issues: DiagnosticIssue[]
  ): RootCauseAnalysis[] {

    return issues.map(
      issue =>
        this.analyze(issue)
    );

  }

}

export const rootCauseAnalyzer =
  new RootCauseAnalyzer();
