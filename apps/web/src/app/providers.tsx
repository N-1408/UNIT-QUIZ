import { Suspense, useCallback, useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { initTelegramWebApp, syncTelegramTheme, getTelegramUser, type TelegramThemePayload } from "@/lib/telegram";
import { useThemeStore } from "@/store/useTheme";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";
import { useAuthStore, type AuthPayload } from "@/store/useAuth";

export const AppProviders = ({ children }: PropsWithChildren) => {
  const theme = useThemeStore((state) => state.theme);
  const setTelegramTheme = useThemeStore((state) => state.setTelegramTheme);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const setSession = useAuthStore((state) => state.setSession);
  const currentSession = useAuthStore((state) => state.session);
  const setAuthStatus = useAuthStore((state) => state.setStatus);
  const authStatus = useAuthStore((state) => state.status);
  const hasBootstrappedRef = useRef(false);
  useEffect(() => {
    if (!currentSession && authStatus === "idle") {
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
    const controller = new AbortController();

    const parseLanguage = (code: unknown): LanguageCode | null => {
      if (code === "uz" || code === "ru" || code === "en") {
        return code;
      }
      return null;
    };
    const parseRole = (role: unknown): AuthPayload["role"] => {
      if (role === "teacher" || role === "admin") {
        return role;
      }
      return "student";
    };

    const syncUser = async () => {
      const fullName = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(" ").trim();

      setAuthStatus("loading");

      try {
        const response = await fetch("/api/users/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            telegramId: tgUser.id,
            fullName: fullName || tgUser.username || "do'stimiz",
            username: tgUser.username ?? null,
            language
          }),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Auth sync failed (${response.status})`);
        }

        const data: {
          tgId: number;
          fullName: string | null;
          firstName: string | null;
          lastName: string | null;
          tgUsername: string | null;
          phoneNumber: string | null;
          lang: string | null;
          role: string | null;
          createdAt: string | null;
        } = await response.json();

        if (controller.signal.aborted) {
          return;
        }

        const normalizedLanguage = parseLanguage(data.lang) ?? language ?? "uz";
        const normalizedRole = parseRole(data.role);
        const payload: AuthPayload = {
          tgId: data.tgId,
          fullName: data.fullName || fullName || tgUser.username || "do'stimiz",
          firstName: data.firstName ?? tgUser.first_name ?? null,
          lastName: data.lastName ?? tgUser.last_name ?? null,
          username: data.tgUsername ?? tgUser.username ?? null,
          phoneNumber: data.phoneNumber ?? null,
          role: normalizedRole,
          language: normalizedLanguage,
          createdAt: data.createdAt,
          token: null
        };

        setSession(payload);
        setAuthStatus("ready");
        if (normalizedLanguage !== language) {
          setLanguage(normalizedLanguage);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("[Auth] bootstrap failed:", error);
          setSession(null);
          setAuthStatus("error", error instanceof Error ? error.message : "Auth sync failed");
        }
      }
    };

    void syncUser();

    return () => controller.abort();
  }, [authStatus, currentSession, language, setAuthStatus, setLanguage, setSession]);

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
