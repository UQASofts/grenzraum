export interface POI {
  id: string;
  name: string;
  czName: string;
  deName?: string;
  description: string;
  czDescription: string;
  deDescription?: string;
  category: "Waterfalls" | "Museums" | "Lakes" | "Hiking" | "Secret Tips";
  image: string;
  elevationGain: string;
  estTime: string;
  distance: string;
  lat: number;
  lng: number;
  stampName: string;
  stampImage: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  status?: "Synced" | "Pending" | "Draft";
  languages?: string[];
  secretTip?: boolean;
}

export interface UserStamp {
  id: string;
  poiId: string;
  poiName: string;
  stampName: string;
  stampImage: string;
  collectedAt: string;
  latitude: number;
  longitude: number;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: number;
  latency: number;
  message: string;
}

export interface DashboardMetric {
  totalPOIs: number;
  totalUsers: number;
  totalStamps: number;
  activeZoneCount: number;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  joinedAt: string;
  stampsCollected: number;
}

export interface AdminSession {
  name: string;
  email: string;
  role: "admin";
}
