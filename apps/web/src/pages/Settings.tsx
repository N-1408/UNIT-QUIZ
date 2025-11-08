import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ProfilePanel } from "@/components/settings/ProfilePanel";
import { PageContainer } from "@/components/layout/Page";
import { useAuthStore } from "@/store/useAuth";
import type { LanguageCode } from "@/store/useLanguage";
import type { TelegramUser } from "@/lib/telegram";

type TelegramUserExtended = TelegramUser & {
  language_code?: string;
  photo_url?: string;
};

const normalizeLanguage = (value?: string | null): LanguageCode | undefined => {
  if (value === "uz" || value === "ru" || value === "en") {
    return value;
  }
  return undefined;
};

export const SettingsPage = () => {
  const { t } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const syncSession = useAuthStore((state) => state.syncSession);
  const mountedRef = useRef(true);
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const runSync = async () => {
      if (hasSyncedRef.current || useAuthStore.getState().session) {
        return;
      }

      const tg = window.Telegram?.WebApp;
      if (!tg) {
        console.warn("[UNIT-QUIZ] Telegram SDK missing inside Settings.");
        return;
      }

      tg.ready?.();

      const resolveUser = (): TelegramUserExtended | undefined => {
        return tg.initDataUnsafe?.user as TelegramUserExtended | undefined;
      };

      let user = resolveUser();

      if (!user?.id) {
        await new Promise<void>((resolve) => {
          let attempts = 0;
          const check = () => {
            user = resolveUser();
            if (user?.id || attempts > 10 || !mountedRef.current) {
              resolve();
              return;
            }
            attempts += 1;
            window.setTimeout(check, 500);
          };
          check();
        });
      }

      if (!user?.id) {
        console.warn("[UNIT-QUIZ] Telegram user not available for Settings resync.");
        return;
      }

      console.log("[UNIT-QUIZ] No session found — attempting Telegram sync from Settings.");
      hasSyncedRef.current = true;

      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      const language = normalizeLanguage(user.language_code ?? null);

      try {
        await syncSession({
          telegramId: user.id,
          fullName: fullName || user.username || "do'stimiz",
          username: user.username ?? null,
          language,
          photoUrl: user.photo_url ?? null
        });
      } catch (error) {
        if (mountedRef.current) {
          console.error("[UNIT-QUIZ] Settings sync error:", error);
        }
      }
    };

    void runSync();

    return () => {
      mountedRef.current = false;
    };
  }, [syncSession]);

  if (!session) {
    return (
      <PageContainer className="flex h-full min-h-[420px] items-center justify-center text-center">
        <p className="max-w-md text-sm text-text-secondary">
          Hisob ma’lumotlari yuklanmoqda yoki Telegram bilan bog‘lanmoqda...
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-text-primary">
          {t("settings.title", { defaultValue: "Sozlamalar" })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("settings.subtitle", { defaultValue: "Profilni o'zingizga yoqqancha sozlang." })}
        </p>
      </div>

      <ProfilePanel />

      {session.role === "admin" ? (
        <button
          type="button"
          className="mt-2 w-full rounded-xl bg-orange-500 py-2 text-sm font-semibold text-white transition duration-swift ease-fluid hover:bg-orange-400"
          onClick={() => window.Telegram?.WebApp?.openLink?.("https://unit-quiz-admin.vercel.app")}
        >
          Admin panel
        </button>
      ) : null}

      <section className="flex flex-col gap-3 rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm">
        <LanguageRadio />
        <ThemeToggle />
      </section>
    </PageContainer>
  );
};
