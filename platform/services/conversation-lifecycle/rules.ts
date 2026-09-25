import type {
  ConversationLifecycleStatus,
} from "@/platform/repositories/conversation-lifecycle";

export const CONVERSATION_LIFECYCLE_RULES: {
  inactivityDays: number;
  allowedTransitions: Record<
    ConversationLifecycleStatus,
    ConversationLifecycleStatus[]
  >;
} = {
  inactivityDays: 30,
  allowedTransitions: {
    open: ["closed", "archived"],
    closed: ["open", "archived"],
    archived: ["open"],
  },
};

export function canTransition(
  from: ConversationLifecycleStatus,
  to: ConversationLifecycleStatus,
): boolean {
  if (from === to) {
    return true;
  }

  const allowed =
    CONVERSATION_LIFECYCLE_RULES.allowedTransitions[
      from
    ];

  return allowed.includes(to);
}

export function isInactive(
  lastActivityAt: string | null | undefined,
  now = new Date(),
  inactivityDays =
    CONVERSATION_LIFECYCLE_RULES.inactivityDays,
): boolean {
  if (!lastActivityAt) {
    return false;
  }

  const lastActivity =
    new Date(lastActivityAt).getTime();

  if (Number.isNaN(lastActivity)) {
    return false;
  }

  const threshold =
    inactivityDays * 24 * 60 * 60 * 1000;

  return (
    now.getTime() - lastActivity >= threshold
  );
}

export function getInactivityThresholdDate(
  now = new Date(),
  inactivityDays =
    CONVERSATION_LIFECYCLE_RULES.inactivityDays,
): string {
  return new Date(
    now.getTime() -
      inactivityDays * 24 * 60 * 60 * 1000,
  ).toISOString();
}
