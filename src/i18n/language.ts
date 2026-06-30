import { POI } from "../types";

export type AppLanguage = "en" | "de" | "cs";

export type DashboardLanguage = "en" | "de";

export const PUBLIC_LANGUAGES: AppLanguage[] = ["en", "de", "cs"];

export const DASHBOARD_LANGUAGES: DashboardLanguage[] = ["en", "de"];

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: "EN",
  de: "DE",
  cs: "CZ",
};

export function isAppLanguage(value: string): value is AppLanguage {
  return value === "en" || value === "de" || value === "cs";
}

export function isDashboardLanguage(value: string): value is DashboardLanguage {
  return value === "en" || value === "de";
}

export function tr(lang: AppLanguage, en: string, de: string, cs: string): string {
  if (lang === "de") return de;
  if (lang === "cs") return cs;
  return en;
}

export function dtr(lang: DashboardLanguage, en: string, de: string): string {
  return lang === "de" ? de : en;
}

export function getPoiName(poi: POI, lang: AppLanguage): string {
  if (lang === "cs") return poi.czName;
  if (lang === "de") return poi.deName || poi.name;
  return poi.name;
}

export function getPoiDescription(poi: POI, lang: AppLanguage): string {
  if (lang === "cs") return poi.czDescription;
  if (lang === "de") return poi.deDescription || poi.description;
  return poi.description;
}

export function getPoiSecondaryName(poi: POI, lang: AppLanguage): string {
  if (lang === "en") return poi.czName;
  if (lang === "de") return poi.czName;
  return poi.name;
}

export function cyclePublicLanguage(current: AppLanguage): AppLanguage {
  const index = PUBLIC_LANGUAGES.indexOf(current);
  return PUBLIC_LANGUAGES[(index + 1) % PUBLIC_LANGUAGES.length];
}
