export type AppView = "home" | "map" | "details" | "navigate" | "stamps" | "admin" | "login" | "register";

export const ROUTES = {
  home: "/",
  map: "/map",
  mapPoi: (poiId: string) => `/map/${poiId}`,
  location: (id: string) => `/location/${id}`,
  navigate: (id: string) => `/navigate/${id}`,
  stamps: "/stamps",
  admin: "/admin",
  login: "/login",
  register: "/register",
  dashboardLogin: "/dashboard/login",
} as const;

export function loginWithReturn(returnTo: string): string {
  return `${ROUTES.login}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function parseAppRoute(pathname: string): { view: AppView; poiId: string | null } {
  if (pathname === ROUTES.home) return { view: "home", poiId: null };
  if (pathname === ROUTES.map) return { view: "map", poiId: null };

  const mapPoiMatch = pathname.match(/^\/map\/([^/]+)$/);
  if (mapPoiMatch) return { view: "map", poiId: mapPoiMatch[1] };

  const locationMatch = pathname.match(/^\/location\/([^/]+)$/);
  if (locationMatch) return { view: "details", poiId: locationMatch[1] };

  const navigateMatch = pathname.match(/^\/navigate\/([^/]+)$/);
  if (navigateMatch) return { view: "navigate", poiId: navigateMatch[1] };

  if (pathname === ROUTES.stamps) return { view: "stamps", poiId: null };
  if (pathname === ROUTES.admin) return { view: "admin", poiId: null };
  if (pathname === ROUTES.login) return { view: "login", poiId: null };
  if (pathname === ROUTES.register) return { view: "register", poiId: null };

  return { view: "home", poiId: null };
}

export function isKnownRoute(pathname: string): boolean {
  if (
    pathname === ROUTES.home ||
    pathname === ROUTES.map ||
    pathname === ROUTES.stamps ||
    pathname === ROUTES.admin ||
    pathname === ROUTES.login ||
    pathname === ROUTES.register
  ) {
    return true;
  }

  return /^\/map\/[^/]+$/.test(pathname) || /^\/location\/[^/]+$/.test(pathname) || /^\/navigate\/[^/]+$/.test(pathname);
}
