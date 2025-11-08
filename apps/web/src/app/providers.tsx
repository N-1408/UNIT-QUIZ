import { Suspense, useCallback, useEffect } from "react";
import type { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { initTelegramWebApp, syncTelegramTheme, type TelegramThemePayload, type TelegramUser } from "@/lib/telegram";
import { useThemeStore } from "@/store/useTheme";
import { useLanguageStore } from "@/store/useLanguage";
import { useAuthStore } from "@/store/useAuth";

async function remoteLog(tag: string, data: unknown) {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL ?? ""}/api/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, data })
    });
  } catch {
    // Ignore logging errors so Mini App flow continues.
  }
}

export const AppProviders = ({ children }: PropsWithChildren) => {
  const theme = useThemeStore((state) => state.theme);
  const setTelegramTheme = useThemeStore((state) => state.setTelegramTheme);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

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
    let attempts = 0;
    let timeoutId: number | null = null;
    let cancelled = false;

    console.log("[UNIT-QUIZ] Telegram init starting with retry...");
    initTelegramWebApp();

    const checkTelegram = async () => {
      try {
        if (cancelled) return;

        const tg = window.Telegram?.WebApp;
        const tgUser = tg?.initDataUnsafe?.user as TelegramUser | undefined;

        await remoteLog("telegram_attempt", {
          attempt: attempts,
          tgExists: Boolean(tg),
          tgUser: tgUser ?? null
        });

        if (!tg || !tgUser) {
          if (attempts < 10) {
            attempts += 1;
            timeoutId = window.setTimeout(checkTelegram, 1000);
          } else {
            await remoteLog("telegram_final_fail", { reason: "No Telegram context after 10s" });
            console.error("[UNIT-QUIZ] Telegram context still missing after retries.");
            useAuthStore.setState((state) => ({ ...state, status: "ready", error: "telegram_user_missing" }));
          }
          return;
        }

        await remoteLog("telegram_ready", { id: tgUser.id, username: tgUser.username });
        tg.ready?.();

        const fullName = `${tgUser.first_name ?? ""} ${tgUser.last_name ?? ""}`.trim();
        const syncPayload = {
          telegramId: tgUser.id,
          fullName: fullName || tgUser.username || "do'stimiz",
          username: tgUser.username ?? null,
          language: tgUser.language_code ?? language,
          photoUrl: tgUser.photo_url ?? null
        };

        console.log("[UNIT-QUIZ] Sync payload being sent ->", syncPayload);
        await remoteLog("sync_payload", syncPayload);

        const payload = await useAuthStore.getState().syncSession(syncPayload);

        if (payload?.language && payload.language !== language) {
          setLanguage(payload.language);
        }
        console.log("[UNIT-QUIZ] Auth store ready.");
      } catch (error) {
        console.error("[UNIT-QUIZ] Bootstrap error:", error);
        useAuthStore.setState((state) => ({ ...state, status: "ready", error: null }));
      }
    };

    checkTelegram();

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [language, setLanguage]);

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
