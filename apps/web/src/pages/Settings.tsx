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
  const retryRef = useRef(false);

  useEffect(() => {
    if (session || retryRef.current) {
      return;
    }

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user as TelegramUserExtended | undefined;

    if (!tgUser?.id) {
      retryRef.current = true;
      console.warn("[UNIT-QUIZ] Telegram user not available for Settings resync.");
      return;
    }

    retryRef.current = true;
    console.log("[UNIT-QUIZ] No session found — attempting Telegram sync from Settings.");

    const fullName = `${tgUser.first_name ?? ""} ${tgUser.last_name ?? ""}`.trim();
    const language = normalizeLanguage(tgUser.language_code ?? null);

    void syncSession({
      telegramId: tgUser.id,
      fullName: fullName || tgUser.username || "do'stimiz",
      username: tgUser.username ?? null,
      language,
      photoUrl: tgUser.photo_url ?? null
    });
  }, [session, syncSession]);

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

      <section className="flex flex-col gap-3 rounded-[20px] border border-border bg-surface/95 p-4 shadow-elev-sm">
        <LanguageRadio />
        <ThemeToggle />
      </section>
    </PageContainer>
  );
};
