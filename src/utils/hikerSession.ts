export interface HikerUser {
  name: string;
  email: string;
  role: "user";
}

const HIKER_SESSION_KEY = "hikerSession";

export function loadHikerSession(): HikerUser | null {
  try {
    const saved = localStorage.getItem(HIKER_SESSION_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as HikerUser;
  } catch {
    return null;
  }
}

export function saveHikerSession(user: HikerUser): void {
  localStorage.setItem(HIKER_SESSION_KEY, JSON.stringify(user));
}

export function clearHikerSession(): void {
  localStorage.removeItem(HIKER_SESSION_KEY);
}
