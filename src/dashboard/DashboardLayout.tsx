import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  FolderOpen,
  Languages,
  Cloud,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Compass,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { DASHBOARD_ROUTES } from "./routes";

const navItems = [
  { to: DASHBOARD_ROUTES.overview, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: DASHBOARD_ROUTES.pois, label: "POIs", icon: MapPin },
  { to: DASHBOARD_ROUTES.media, label: "Media", icon: FolderOpen },
  { to: DASHBOARD_ROUTES.translations, label: "Translations", icon: Languages },
  { to: DASHBOARD_ROUTES.bayerncloud, label: "BayernCloud", icon: Cloud },
  { to: DASHBOARD_ROUTES.users, label: "Users", icon: Users },
  { to: DASHBOARD_ROUTES.settings, label: "Settings", icon: Settings },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/pois": "Points of Interest",
  "/dashboard/users": "User Management",
  "/dashboard/bayerncloud": "BayernCloud Sync",
  "/dashboard/media": "Media Library",
  "/dashboard/translations": "Translations",
  "/dashboard/settings": "Settings",
};

export default function DashboardLayout() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  const handleLogout = () => {
    logout();
    navigate(DASHBOARD_ROUTES.login);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-6">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-600 p-2 text-white">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-700">Admin Panel</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                LR Discovery CMS
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3 space-y-1">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {admin?.name.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">{admin?.name}</p>
              <p className="truncate text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-lg font-bold text-emerald-800">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <input
              type="search"
              placeholder="Search POIs, Users..."
              className="hidden rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:block w-56"
            />
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-500 hover:text-emerald-700"
            >
              View Live Site
            </a>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
