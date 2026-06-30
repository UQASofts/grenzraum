import { Navigate, Route, Routes } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import DashboardLayout from "./DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import DashboardPois from "./pages/DashboardPois";
import DashboardUsers from "./pages/DashboardUsers";
import DashboardBayernCloud from "./pages/DashboardBayernCloud";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import { DASHBOARD_ROUTES } from "./routes";

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { admin } = useAdminAuth();
  if (!admin) {
    return <Navigate to={DASHBOARD_ROUTES.login} replace />;
  }
  return <>{children}</>;
}

export default function DashboardApp() {
  return (
    <DashboardGuard>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="pois" element={<DashboardPois />} />
          <Route path="users" element={<DashboardUsers />} />
          <Route path="bayerncloud" element={<DashboardBayernCloud />} />
          <Route
            path="media"
            element={
              <DashboardPlaceholder
                title="Media Library"
                description="Upload and manage images for POIs and stamp assets."
              />
            }
          />
          <Route
            path="translations"
            element={
              <DashboardPlaceholder
                title="Translations"
                description="Manage EN, CS, and DE content for all destinations."
              />
            }
          />
          <Route
            path="settings"
            element={
              <DashboardPlaceholder
                title="Settings"
                description="Configure CMS preferences and API integrations."
              />
            }
          />
        </Route>
      </Routes>
    </DashboardGuard>
  );
}
