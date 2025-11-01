import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./en";
import uz from "./uz";
import ru from "./ru";

export type Lang = "en" | "uz" | "ru";
type Dict = Record<string, string>;

const DICTS: Record<Lang, Dict> = { en, uz, ru };
const STORAGE_KEY = "lang";
const FALLBACK_LANG: Lang = "en";

function readStoredLang(): Lang {
  if (typeof window === "undefined") {
    return FALLBACK_LANG;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "uz" || stored === "ru" || stored === "en" ? (stored as Lang) : FALLBACK_LANG;
}

const I18nCtx = createContext<{
  lang: Lang;
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
}>({
  lang: FALLBACK_LANG,
  t: (key: string) => key,
  setLang: () => undefined
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readStoredLang());

  const setLang = (value: Lang) => {
    setLangState((prev) => {
      if (prev === value) {
        return prev;
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, value);
      }
      return value;
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const dict = DICTS[lang] ?? en;

  const t = useMemo(() => {
    return (key: string) => dict[key] ?? en[key] ?? key;
  }, [dict]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t]);

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
