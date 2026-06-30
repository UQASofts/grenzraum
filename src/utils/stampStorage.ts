import { INITIAL_USER_STAMPS } from "../data";
import { UserStamp } from "../types";

export function defaultUserStamps(): UserStamp[] {
  return INITIAL_USER_STAMPS.map((stamp) => ({
    ...stamp,
    unlocked: false,
    collectedAt: "",
  }));
}

export function userStampsKey(email: string): string {
  return `userStamps:${email}`;
}

export function loadUserStamps(email: string): UserStamp[] {
  try {
    const saved = localStorage.getItem(userStampsKey(email));
    if (saved) {
      return JSON.parse(saved) as UserStamp[];
    }
  } catch {
    /* ignore */
  }
  return defaultUserStamps();
}

export function saveUserStamps(email: string, stamps: UserStamp[]): void {
  localStorage.setItem(userStampsKey(email), JSON.stringify(stamps));
}

export function unlockStampForPoi(
  stamps: UserStamp[],
  poiId: string
): { stamps: UserStamp[]; wasNew: boolean } {
  const existing = stamps.find((s) => s.poiId === poiId);
  if (!existing) {
    return { stamps, wasNew: false };
  }
  if (existing.unlocked) {
    return { stamps, wasNew: false };
  }

  const collectedAt = new Date().toISOString().replace("T", " ").substring(0, 16);
  return {
    stamps: stamps.map((stamp) =>
      stamp.poiId === poiId ? { ...stamp, unlocked: true, collectedAt } : stamp
    ),
    wasNew: true,
  };
}

const PENDING_COLLECT_KEY = "pendingStampCollect";

export function persistPendingCollect(poiId: string): void {
  localStorage.setItem(PENDING_COLLECT_KEY, poiId);
}

export function consumePendingCollect(): string | null {
  let poiId = localStorage.getItem(PENDING_COLLECT_KEY);
  if (!poiId) {
    try {
      poiId = sessionStorage.getItem(PENDING_COLLECT_KEY);
    } catch {
      /* ignore */
    }
  }
  if (poiId) {
    localStorage.removeItem(PENDING_COLLECT_KEY);
    try {
      sessionStorage.removeItem(PENDING_COLLECT_KEY);
    } catch {
      /* ignore */
    }
  }
  return poiId;
}
