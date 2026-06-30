import { AppLanguage, DashboardLanguage, LANGUAGE_LABELS } from "../i18n/language";

interface PublicLanguageSwitcherProps {
  language: AppLanguage;
  onChange: (lang: AppLanguage) => void;
  className?: string;
  compact?: boolean;
}

interface DashboardLanguageSwitcherProps {
  language: DashboardLanguage;
  onChange: (lang: DashboardLanguage) => void;
  className?: string;
}

export function PublicLanguageSwitcher({
  language,
  onChange,
  className = "",
  compact = false,
}: PublicLanguageSwitcherProps) {
  const langs: AppLanguage[] = ["en", "de", "cs"];

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`rounded-lg font-mono font-bold transition-colors cursor-pointer ${
            compact ? "px-2 py-1 text-[10px]" : "px-2.5 py-1.5 text-xs"
          } ${
            language === lang
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}

export function DashboardLanguageSwitcher({
  language,
  onChange,
  className = "",
}: DashboardLanguageSwitcherProps) {
  const langs: DashboardLanguage[] = ["en", "de"];

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 ${className}`}
      role="group"
      aria-label="Dashboard language"
    >
      {langs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`rounded-md px-2.5 py-1 text-xs font-mono font-bold transition-colors cursor-pointer ${
            language === lang
              ? "bg-white text-emerald-700 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
