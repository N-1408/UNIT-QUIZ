import { Suspense, useEffect } from "react";
import type { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { initTelegramWebApp, syncTelegramTheme, getTelegramUser } from "@/lib/telegram";
import { useThemeStore } from "@/store/useTheme";
import { useLanguageStore } from "@/store/useLanguage";
import { useAuthStore } from "@/store/useAuth";

export const AppProviders = ({ children }: PropsWithChildren) => {
  const theme = useThemeStore((state) => state.theme);
  const setTelegramTheme = useThemeStore((state) => state.setTelegramTheme);
  const language = useLanguageStore((state) => state.language);
  const setSession = useAuthStore((state) => state.setSession);
  const currentSession = useAuthStore((state) => state.session);

  useEffect(() => {
    initTelegramWebApp();
    if (!currentSession) {
      const tgUser = getTelegramUser();
      if (tgUser) {
        const fullName = [tgUser.first_name, tgUser.last_name]
          .filter(Boolean)
          .join(" ")
          .trim();
        setSession({
          tgId: tgUser.id,
          fullName: fullName || tgUser.username || "do'stimiz",
          role: "student"
        });
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const cleanup = syncTelegramTheme(({ colorScheme }) => {
      setTelegramTheme(colorScheme);
    });
    return cleanup;
  }, [setTelegramTheme]);

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
