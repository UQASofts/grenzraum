import { AppLanguage, tr } from "../i18n/language";

export function useComponentT(language: AppLanguage) {
  return (en: string, de: string, cs: string) => tr(language, en, de, cs);
}
