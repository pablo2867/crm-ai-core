import { AIEvent } from "@/platform/events";

export interface AutomationRule<T = unknown> {
  id: string;

  name: string;

  enabled: boolean;

  event: string;

  condition?: (
    event: AIEvent<T>
  ) => boolean;

  action: (
    event: AIEvent<T>
  ) => Promise<void> | void;
}