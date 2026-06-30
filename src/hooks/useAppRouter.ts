import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseAppRoute, ROUTES } from "../routes";

export function useAppRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  const { view, poiId } = useMemo(
    () => parseAppRoute(location.pathname),
    [location.pathname]
  );

  const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);
  const goMap = useCallback(
    (id?: string) => navigate(id ? ROUTES.mapPoi(id) : ROUTES.map),
    [navigate]
  );
  const goLocation = useCallback(
    (id: string) => navigate(ROUTES.location(id)),
    [navigate]
  );
  const goStamps = useCallback(() => navigate(ROUTES.stamps), [navigate]);
  const goAdmin = useCallback(() => navigate(ROUTES.admin), [navigate]);
  const goLogin = useCallback(() => navigate(ROUTES.login), [navigate]);
  const goRegister = useCallback(() => navigate(ROUTES.register), [navigate]);

  return {
    view,
    poiId,
    pathname: location.pathname,
    search: location.search,
    goHome,
    goMap,
    goLocation,
    goStamps,
    goAdmin,
    goLogin,
    goRegister,
    navigate,
  };
}
