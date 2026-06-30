import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useDashboardLanguage } from "../context/DashboardLanguageContext";
import { DashboardLanguageSwitcher } from "../components/LanguageSwitcher";
import { dashboardUi } from "../i18n/dashboard";
import { DASHBOARD_ROUTES } from "./routes";

export default function DashboardLogin() {
  const { admin, login } = useAdminAuth();
  const { language, setLanguage } = useDashboardLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (admin) {
    navigate(DASHBOARD_ROUTES.root, { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      navigate(DASHBOARD_ROUTES.root);
    } else {
      setError(dashboardUi.invalidCredentials(language));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-4 flex justify-end">
          <DashboardLanguageSwitcher language={language} onChange={setLanguage} />
        </div>
        <div className="mb-6 text-center">
          <Compass className="mx-auto mb-3 h-10 w-10 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900">{dashboardUi.loginTitle(language)}</h1>
          <p className="mt-1 text-sm text-slate-500">{dashboardUi.loginSubtitle(language)}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
              {dashboardUi.email(language)}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              placeholder="admin@forestmail.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
              {dashboardUi.password(language)}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500"
          >
            {dashboardUi.signIn(language)}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setEmail("admin@forestmail.com");
            setPassword("secretcms2026");
          }}
          className="mt-4 w-full text-center text-xs text-slate-400 hover:text-emerald-600"
        >
          {dashboardUi.demoCredentials(language)}
        </button>

        <p className="mt-6 text-center text-xs text-slate-400">
          <a href="/" className="text-emerald-600 hover:underline">
            {dashboardUi.backToSite(language)}
          </a>
        </p>
      </div>
    </div>
  );
}
