import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { INITIAL_POIS, INITIAL_API_LOGS, INITIAL_DASHBOARD_USERS } from "../data/dashboard";
import { POI, DashboardUser, ApiLog } from "../types";

const BROKEN_WHITE_GORGE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCc1Gv8z2c39Yzo5I_oxOdN7exXv30262puSobPRgh0lgW3wnKyB_6AtXEWpjlZSuLrGB4xnNjeAY89dZz67beh1AfkmUlaESvtUZ0t2vYl4lSBhCgkUUq9YOiMvaq_L6wz2HE37waV7MsOodXc20spM2AfTs4G8awQkFn-vXBZ-e30ca2mDSGoD2cnGJrCH_NZRc50AL4YphIsVWFqGvN629VIj4xKEUNEr8tOOtbZClqapzaD0sMh7pCdDmBvgxJurPCP56zBeJX";

function hydrateStoredPois(stored: POI[]): POI[] {
  const defaultsById = new Map(INITIAL_POIS.map((poi) => [poi.id, poi]));

  return stored.map((poi) => {
    const defaults = defaultsById.get(poi.id);
    if (!defaults) return poi;

    const imageBroken =
      poi.id === "white-gorge-waterfall" &&
      (!poi.image || poi.image === BROKEN_WHITE_GORGE_IMAGE);

    return imageBroken ? { ...poi, image: defaults.image } : poi;
  });
}

function loadInitialPois(): POI[] {
  const saved = localStorage.getItem("cms_pois");
  if (!saved) return INITIAL_POIS;

  try {
    const stored = JSON.parse(saved) as POI[];
    const hydrated = hydrateStoredPois(stored);
    if (JSON.stringify(hydrated) !== JSON.stringify(stored)) {
      localStorage.setItem("cms_pois", JSON.stringify(hydrated));
    }
    return hydrated;
  } catch {
    return INITIAL_POIS;
  }
}

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
  const [pois, setPois] = useState<POI[]>(loadInitialPois);

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
