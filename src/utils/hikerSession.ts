export interface HikerUser {
  name: string;
  email: string;
  role: "user";
}

const HIKER_SESSION_KEY = "hikerSession";
const HIKER_SESSION_COOKIE = "hikerSession";

function readSessionCookie(): HikerUser | null {
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${HIKER_SESSION_COOKIE}=([^;]*)`)
    );
    if (!match?.[1]) return null;
    return JSON.parse(decodeURIComponent(match[1])) as HikerUser;
  } catch {
    return null;
  }
}

function writeSessionCookie(user: HikerUser): void {
  const value = encodeURIComponent(JSON.stringify(user));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${HIKER_SESSION_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax${secure}`;
}

function clearSessionCookie(): void {
  document.cookie = `${HIKER_SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function loadHikerSession(): HikerUser | null {
  try {
    const saved = localStorage.getItem(HIKER_SESSION_KEY);
    if (saved) {
      return JSON.parse(saved) as HikerUser;
    }
  } catch {
    /* localStorage blocked (iOS private mode) — try cookie */
  }
  return readSessionCookie();
}

export function saveHikerSession(user: HikerUser): void {
  try {
    localStorage.setItem(HIKER_SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore — cookie fallback below */
  }
  writeSessionCookie(user);
}

export function clearHikerSession(): void {
  try {
    localStorage.removeItem(HIKER_SESSION_KEY);
  } catch {
    /* ignore */
  }
  clearSessionCookie();
}

/** Prefer in-memory user, but always fall back to persisted session (iOS new-tab / QR scan). */
export function resolveHikerUser(current: HikerUser | null): HikerUser | null {
  return current ?? loadHikerSession();
}

export function isHikerLoggedIn(current: HikerUser | null): boolean {
  return resolveHikerUser(current) !== null;
}
