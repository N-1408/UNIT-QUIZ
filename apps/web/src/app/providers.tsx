import { Suspense, useCallback, useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { initTelegramWebApp, syncTelegramTheme, getTelegramUser, type TelegramThemePayload } from "@/lib/telegram";
import { useThemeStore } from "@/store/useTheme";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";
import { useAuthStore } from "@/store/useAuth";

export const AppProviders = ({ children }: PropsWithChildren) => {
  const theme = useThemeStore((state) => state.theme);
  const setTelegramTheme = useThemeStore((state) => state.setTelegramTheme);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const currentSession = useAuthStore((state) => state.session);
  const authStatus = useAuthStore((state) => state.status);
  const syncSession = useAuthStore((state) => state.syncSession);
  const hasBootstrappedRef = useRef(false);
  useEffect(() => {
    if (!currentSession && authStatus !== "loading") {
      hasBootstrappedRef.current = false;
    }
  }, [authStatus, currentSession]);

  const applyTelegramThemeParams = useCallback((payload?: TelegramThemePayload["themeParams"]) => {
    const root = document.documentElement;

    const hexToRgb = (hex?: string) => {
      if (!hex) return null;
      const normalized = hex.replace("#", "");
      if (normalized.length !== 6 && normalized.length !== 8) return null;
      const intVal = parseInt(normalized.slice(0, 6), 16);
      const r = (intVal >> 16) & 255;
      const g = (intVal >> 8) & 255;
      const b = intVal & 255;
      return `${r} ${g} ${b}`;
    };

    const setRgbVar = (name: string, value?: string) => {
      const rgb = hexToRgb(value);
      if (rgb) {
        root.style.setProperty(name, rgb);
      } else {
        root.style.removeProperty(name);
      }
    };

    setRgbVar("--color-ui-background", payload?.bg_color);
    setRgbVar("--color-ui-surface", payload?.secondary_bg_color ?? payload?.bg_color);
    setRgbVar("--color-text-primary", payload?.text_color);
    setRgbVar("--color-text-secondary", payload?.hint_color);
    setRgbVar("--color-text-muted", payload?.hint_color);
  }, []);

  useEffect(() => {
    initTelegramWebApp();
  }, []);

  useEffect(() => {
    if (currentSession || hasBootstrappedRef.current || authStatus === "loading") {
      return;
    }

    const tgUser = getTelegramUser();
    if (!tgUser) {
      return;
    }

    hasBootstrappedRef.current = true;
    const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim();

    void (async () => {
      const payload = await syncSession({
        telegramId: tgUser.id,
        fullName: fullName || tgUser.username || "do'stimiz",
        username: tgUser.username ?? null,
        language
      });

      if (payload?.language && payload.language !== language) {
        setLanguage(payload.language);
      }
    })();
  }, [authStatus, currentSession, language, setLanguage, syncSession]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    const timeout = window.setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 320);
    return () => window.clearTimeout(timeout);
  }, [theme]);

  useEffect(() => {
    const cleanup = syncTelegramTheme(({ colorScheme, themeParams }) => {
      setTelegramTheme(colorScheme);
      applyTelegramThemeParams(themeParams);
    });
    return cleanup;
  }, [setTelegramTheme, applyTelegramThemeParams]);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div className="p-6 text-sm text-text-secondary">Yuklanmoqda...</div>}>
        {children}
      </Suspense>
    </I18nextProvider>
  );
};
