import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { INITIAL_POIS, INITIAL_API_LOGS, INITIAL_DASHBOARD_USERS } from "../data/dashboard";
import { POI, DashboardUser, ApiLog } from "../types";

interface DataContextValue {
  pois: POI[];
  users: DashboardUser[];
  apiLogs: ApiLog[];
  savePoi: (poi: POI) => void;
  deletePoi: (id: string) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [pois, setPois] = useState<POI[]>(() => {
    const saved = localStorage.getItem("cms_pois");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return INITIAL_POIS;
  });

  const [users, setUsers] = useState<DashboardUser[]>(() => {
    const saved = localStorage.getItem("cms_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return INITIAL_DASHBOARD_USERS;
  });

  const [apiLogs] = useState<ApiLog[]>(INITIAL_API_LOGS);

  const persistPois = useCallback((next: POI[]) => {
    setPois(next);
    localStorage.setItem("cms_pois", JSON.stringify(next));
  }, []);

  const persistUsers = useCallback((next: DashboardUser[]) => {
    setUsers(next);
    localStorage.setItem("cms_users", JSON.stringify(next));
  }, []);

  const savePoi = useCallback(
    (poi: POI) => {
      persistPois(
        pois.some((p) => p.id === poi.id)
          ? pois.map((p) => (p.id === poi.id ? poi : p))
          : [poi, ...pois]
      );
    },
    [pois, persistPois]
  );

  const deletePoi = useCallback(
    (id: string) => {
      persistPois(pois.filter((p) => p.id !== id));
    },
    [pois, persistPois]
  );

  const deleteUser = useCallback(
    (id: string) => {
      persistUsers(users.filter((u) => u.id !== id));
    },
    [users, persistUsers]
  );

  const toggleUserStatus = useCallback(
    (id: string) => {
      persistUsers(
        users.map((u) =>
          u.id === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        )
      );
    },
    [users, persistUsers]
  );

  const value = useMemo(
    () => ({
      pois,
      users,
      apiLogs,
      savePoi,
      deletePoi,
      deleteUser,
      toggleUserStatus,
    }),
    [pois, users, apiLogs, savePoi, deletePoi, deleteUser, toggleUserStatus]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
