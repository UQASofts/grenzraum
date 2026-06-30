import React, { createContext, useContext, useMemo, useState } from "react";
import { DashboardLanguage, isDashboardLanguage } from "../i18n/language";

const STORAGE_KEY = "dashboard_language";

function loadLanguage(): DashboardLanguage {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && isDashboardLanguage(saved) ? saved : "en";
}

interface DashboardLanguageContextValue {
  language: DashboardLanguage;
  setLanguage: (lang: DashboardLanguage) => void;
}

const DashboardLanguageContext = createContext<DashboardLanguageContextValue | null>(null);

export function DashboardLanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<DashboardLanguage>(loadLanguage);

  const setLanguage = (lang: DashboardLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <DashboardLanguageContext.Provider value={value}>
      {children}
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLanguage() {
  const ctx = useContext(DashboardLanguageContext);
  if (!ctx) {
    throw new Error("useDashboardLanguage must be used within DashboardLanguageProvider");
  }
  return ctx;
}
