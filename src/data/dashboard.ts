import { INITIAL_POIS, INITIAL_API_LOGS } from "../data";
import { POI, DashboardUser, ApiLog } from "../types";

export const INITIAL_DASHBOARD_USERS: DashboardUser[] = [
  {
    id: "u1",
    name: "Lukas Müller",
    email: "user@example.com",
    role: "user",
    status: "active",
    joinedAt: "2026-01-12",
    stampsCollected: 4,
  },
  {
    id: "u2",
    name: "Anna Nováková",
    email: "anna.n@forestmail.com",
    role: "user",
    status: "active",
    joinedAt: "2026-02-03",
    stampsCollected: 7,
  },
  {
    id: "u3",
    name: "Tomáš Horák",
    email: "tomas.h@forestmail.com",
    role: "user",
    status: "inactive",
    joinedAt: "2025-11-20",
    stampsCollected: 2,
  },
  {
    id: "u4",
    name: "Admin CMS",
    email: "admin@forestmail.com",
    role: "admin",
    status: "active",
    joinedAt: "2025-09-01",
    stampsCollected: 0,
  },
  {
    id: "u5",
    name: "Elena Berger",
    email: "elena.b@forestmail.com",
    role: "user",
    status: "active",
    joinedAt: "2026-03-15",
    stampsCollected: 5,
  },
];

export { INITIAL_POIS, INITIAL_API_LOGS };
