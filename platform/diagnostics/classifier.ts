import type {
  DiagnosticIssue,
  DiagnosticSeverity,
} from "./types";

export interface ClassifiedIssue {

  issueId: string;

  severity: DiagnosticSeverity;

  category: DiagnosticIssue["category"];

  repairable: boolean;

  risk: DiagnosticIssue["risk"];

  priority: number;

}

function severityPriority(
  severity: DiagnosticSeverity
): number {

  switch (severity) {

    case "critical":
      return 100;

    case "high":
      return 80;

    case "medium":
      return 60;

    case "low":
      return 30;

    case "info":
      return 10;

  }

}

export class DiagnosticIssueClassifier {

  classify(
    issue: DiagnosticIssue
  ): ClassifiedIssue {

    return {

      issueId:
        issue.id,

      severity:
        issue.severity,

      category:
        issue.category,

      repairable:
        issue.repairable,

      risk:
        issue.risk,

      priority:
        severityPriority(
          issue.severity
        ),

    };

  }

  classifyAll(
    issues: DiagnosticIssue[]
  ): ClassifiedIssue[] {

    return issues
      .map(
        issue =>
          this.classify(issue)
      )
      .sort(
        (a, b) =>
          b.priority -
          a.priority
      );

  }

}

export const diagnosticIssueClassifier =
  new DiagnosticIssueClassifier();
