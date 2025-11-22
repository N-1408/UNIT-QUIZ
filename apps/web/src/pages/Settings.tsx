import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { PageContainer } from "@/components/layout/Page";
import { useAuthStore } from "@/store/useAuth";
import type { LanguageCode } from "@/store/useLanguage";
import type { TelegramUser } from "@/lib/telegram";
import { User, Shield, Globe, Palette, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-surface-alt"></div>
          <div className="h-4 w-32 rounded bg-surface-alt"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="gap-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-1 px-2">
        <h2 className="text-2xl font-bold text-text-primary">
          {t("settings.title", { defaultValue: "Sozlamalar" })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("settings.subtitle", { defaultValue: "Profilni o'zingizga moslang." })}
        </p>
      </div>

      {/* Glass Profile Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand to-brand-gradient1 p-1 shadow-2xl shadow-brand/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="relative flex flex-col items-center gap-4 rounded-[30px] bg-white/10 p-6 backdrop-blur-md">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-white/30 blur-lg animate-pulse"></div>
            {session.photoUrl ? (
              <img
                src={session.photoUrl}
                alt={session.fullName}
                className="relative h-24 w-24 rounded-full border-4 border-white/20 object-cover shadow-xl"
              />
            ) : (
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/20 bg-brand-light/20 text-white shadow-xl">
                <User className="h-10 w-10" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand shadow-lg">
              <Shield className="h-4 w-4 fill-current" />
            </div>
          </div>

          <div className="text-center text-white">
            <h3 className="text-xl font-bold">{session.fullName}</h3>
            <p className="text-sm text-brand-light/80">@{session.username || "username"}</p>
          </div>

          <div className="flex w-full gap-2">
            <div className="flex flex-1 flex-col items-center rounded-2xl bg-black/20 p-3 backdrop-blur-sm">
              <span className="text-xs font-medium text-brand-light/70">Role</span>
              <span className="font-bold text-white capitalize">{session.role}</span>
            </div>
            <div className="flex flex-1 flex-col items-center rounded-2xl bg-black/20 p-3 backdrop-blur-sm">
              <span className="text-xs font-medium text-brand-light/70">ID</span>
              <span className="font-bold text-white font-mono text-xs mt-1">{session.telegramId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Button */}
      {session.role === "admin" && (
        <button
          type="button"
          className="group relative w-full overflow-hidden rounded-[24px] bg-surface p-1 shadow-elev-sm transition-all hover:shadow-elev-md active:scale-[0.98]"
          onClick={() => window.Telegram?.WebApp?.openLink?.("https://unit-quiz-admin.vercel.app")}
        >
          <div className="relative flex items-center justify-between rounded-[20px] bg-surface-alt/50 p-4 transition-colors group-hover:bg-brand-light/30">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-text-primary">Admin Panel</h4>
                <p className="text-xs text-text-secondary">Boshqaruv paneliga o'tish</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-text-secondary transition-transform group-hover:translate-x-1" />
          </div>
        </button>
      )}

      {/* Settings Sections */}
      <div className="space-y-4">
        <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-text-secondary">Ilova Sozlamalari</h3>

        <div className="overflow-hidden rounded-[24px] border border-border bg-surface/80 backdrop-blur-md shadow-sm">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Globe className="h-4 w-4" />
              </div>
              <span className="font-bold text-text-primary">Til (Language)</span>
            </div>
            <LanguageRadio />
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Palette className="h-4 w-4" />
              </div>
              <span className="font-bold text-text-primary">Mavzu (Theme)</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <p className="text-xs text-text-muted">Version 1.0.0 • Unit Quiz</p>
      </div>
    </PageContainer>
  );
};
