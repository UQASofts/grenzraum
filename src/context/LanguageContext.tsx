import React, { createContext, useContext, useMemo, useState } from "react";
import { AppLanguage, isAppLanguage } from "../i18n/language";

const STORAGE_KEY = "app_language";

function loadLanguage(): AppLanguage {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved && isAppLanguage(saved) ? saved : "en";
}

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(loadLanguage);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
