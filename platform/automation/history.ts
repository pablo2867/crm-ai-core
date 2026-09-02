export interface AutomationHistoryItem {
  id: string;

  rule: string;

  event: string;

  status: "SUCCESS" | "ERROR";

  duration: number;

  createdAt: Date;

  error?: string;
}

const history: AutomationHistoryItem[] = [];

export function addHistory(
  item: AutomationHistoryItem
) {
  history.unshift(item);

  if (history.length > 100) {
    history.pop();
  }
}

export function getHistory() {
  return history;
}

export function clearHistory() {
  history.length = 0;
}