import { DashboardLanguage, dtr } from "./language";

export function getDashboardNav(lang: DashboardLanguage) {
  return [
    { key: "overview", label: dtr(lang, "Dashboard", "Dashboard") },
    { key: "pois", label: dtr(lang, "POIs", "POIs") },
    { key: "media", label: dtr(lang, "Media", "Medien") },
    { key: "translations", label: dtr(lang, "Translations", "Übersetzungen") },
    { key: "bayerncloud", label: dtr(lang, "BayernCloud", "BayernCloud") },
    { key: "users", label: dtr(lang, "Users", "Benutzer") },
    { key: "settings", label: dtr(lang, "Settings", "Einstellungen") },
  ];
}

export function getDashboardPageTitle(pathname: string, lang: DashboardLanguage): string {
  const titles: Record<string, [string, string]> = {
    "/dashboard": ["Dashboard Overview", "Dashboard-Übersicht"],
    "/dashboard/pois": ["Points of Interest", "Sehenswürdigkeiten"],
    "/dashboard/users": ["User Management", "Benutzerverwaltung"],
    "/dashboard/bayerncloud": ["BayernCloud Sync", "BayernCloud-Sync"],
    "/dashboard/media": ["Media Library", "Medienbibliothek"],
    "/dashboard/translations": ["Translations", "Übersetzungen"],
    "/dashboard/settings": ["Settings", "Einstellungen"],
  };
  const pair = titles[pathname] ?? ["Dashboard", "Dashboard"];
  return dtr(lang, pair[0], pair[1]);
}

export const dashboardUi = {
  adminPanel: (lang: DashboardLanguage) => dtr(lang, "Admin Panel", "Admin-Bereich"),
  cmsSubtitle: (lang: DashboardLanguage) => dtr(lang, "LR Discovery CMS", "LR Discovery CMS"),
  help: (lang: DashboardLanguage) => dtr(lang, "Help", "Hilfe"),
  logout: (lang: DashboardLanguage) => dtr(lang, "Logout", "Abmelden"),
  administrator: (lang: DashboardLanguage) => dtr(lang, "Administrator", "Administrator"),
  searchPlaceholder: (lang: DashboardLanguage) =>
    dtr(lang, "Search POIs, Users...", "POIs, Benutzer suchen..."),
  viewLiveSite: (lang: DashboardLanguage) => dtr(lang, "View Live Site", "Live-Seite öffnen"),
  deletePoiConfirm: (lang: DashboardLanguage) =>
    dtr(lang, "Delete this point of interest?", "Diesen POI wirklich löschen?"),
  poiDirectory: (lang: DashboardLanguage) => dtr(lang, "Point of Interest Directory", "POI-Verzeichnis"),
  poiDirectoryDesc: (lang: DashboardLanguage) =>
    dtr(
      lang,
      "Manage destinations synced across the Šumava–Bayern region.",
      "Ziele in der Šumava–Bayern-Region verwalten."
    ),
  addPoi: (lang: DashboardLanguage) => dtr(lang, "Add New POI", "Neuen POI hinzufügen"),
  totalPois: (lang: DashboardLanguage) => dtr(lang, "Total Regional POIs", "POIs gesamt"),
  passHolders: (lang: DashboardLanguage) => dtr(lang, "Registered Pass Holders", "Registrierte Passinhaber"),
  stampsIssued: (lang: DashboardLanguage) => dtr(lang, "Ledger Stamps Issued", "Ausgestellte Stempel"),
  syncNodes: (lang: DashboardLanguage) => dtr(lang, "Synchronized Nodes", "Synchronisierte Knoten"),
  online: (lang: DashboardLanguage) => dtr(lang, "100% ONLINE", "100 % ONLINE"),
  name: (lang: DashboardLanguage) => dtr(lang, "Name", "Name"),
  category: (lang: DashboardLanguage) => dtr(lang, "Category", "Kategorie"),
  status: (lang: DashboardLanguage) => dtr(lang, "Status", "Status"),
  actions: (lang: DashboardLanguage) => dtr(lang, "Actions", "Aktionen"),
  edit: (lang: DashboardLanguage) => dtr(lang, "Edit", "Bearbeiten"),
  delete: (lang: DashboardLanguage) => dtr(lang, "Delete", "Löschen"),
  qrCode: (lang: DashboardLanguage) => dtr(lang, "QR Code", "QR-Code"),
  overviewTotalPois: (lang: DashboardLanguage) => dtr(lang, "Total POIs", "POIs gesamt"),
  overviewTotalUsers: (lang: DashboardLanguage) => dtr(lang, "Total Users", "Benutzer gesamt"),
  overviewTotalStamps: (lang: DashboardLanguage) => dtr(lang, "Total Stamps", "Stempel gesamt"),
  active: (lang: DashboardLanguage) => dtr(lang, "active", "aktiv"),
  userEngagement: (lang: DashboardLanguage) => dtr(lang, "User Engagement", "Nutzeraktivität"),
  engagementDesc: (lang: DashboardLanguage) =>
    dtr(lang, "Daily active users over the last 30 days", "Täglich aktive Nutzer der letzten 30 Tage"),
  recentActivity: (lang: DashboardLanguage) => dtr(lang, "Recent Activity", "Letzte Aktivität"),
  quickActions: (lang: DashboardLanguage) => dtr(lang, "Quick Actions", "Schnellaktionen"),
  managePois: (lang: DashboardLanguage) => dtr(lang, "Manage POIs", "POIs verwalten"),
  viewUsers: (lang: DashboardLanguage) => dtr(lang, "View Users", "Benutzer anzeigen"),
  loginTitle: (lang: DashboardLanguage) => dtr(lang, "Admin CMS Login", "Admin-CMS-Anmeldung"),
  loginSubtitle: (lang: DashboardLanguage) =>
    dtr(lang, "Sign in to manage POIs, users, and BayernCloud sync.", "Anmelden, um POIs, Benutzer und BayernCloud zu verwalten."),
  invalidCredentials: (lang: DashboardLanguage) => dtr(lang, "Invalid admin credentials.", "Ungültige Admin-Zugangsdaten."),
  email: (lang: DashboardLanguage) => dtr(lang, "Email", "E-Mail"),
  password: (lang: DashboardLanguage) => dtr(lang, "Password", "Passwort"),
  signIn: (lang: DashboardLanguage) => dtr(lang, "Sign In to Dashboard", "Im Dashboard anmelden"),
  demoCredentials: (lang: DashboardLanguage) => dtr(lang, "Use demo admin credentials", "Demo-Zugangsdaten verwenden"),
  backToSite: (lang: DashboardLanguage) => dtr(lang, "← Back to public site", "← Zur öffentlichen Seite"),
};
