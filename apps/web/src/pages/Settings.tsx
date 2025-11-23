import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { useAuthStore } from "@/store/useAuth";
import { apiClient } from "@/lib/apiClient";
import type { LanguageCode } from "@/store/useLanguage";
import type { TelegramUser } from "@/lib/telegram";
import { User, Shield, Globe, Palette, ChevronRight } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mountedRef.current = true;

    const runSync = async () => {
      if (useAuthStore.getState().session) {
        setIsLoading(false);
        return;
      }

      const tg = window.Telegram?.WebApp;
      if (tg) tg.ready?.();

      const resolveUser = (): TelegramUserExtended | undefined => {
        return tg?.initDataUnsafe?.user as TelegramUserExtended | undefined;
      };

      let user = resolveUser();

      // If no user immediately, wait a bit (only if in Telegram env)
      if (!user?.id && tg?.initData) {
        await new Promise<void>((resolve) => {
          let attempts = 0;
          const check = () => {
            user = resolveUser();
            if (user?.id || attempts > 5 || !mountedRef.current) {
              resolve();
              return;
            }
            attempts += 1;
            window.setTimeout(check, 200);
          };
          check();
        });
      }

      if (!user?.id) {
        console.log("[UNIT-QUIZ] Telegram user not found. Attempting API fetch (Browser Mode)...");
        try {
          const res = await apiClient.getCurrentUser();
          if (res.success && res.data) {
            const data = res.data as any;
            useAuthStore.getState().setSession({
              tgId: data.tgId || 0,
              telegramId: data.telegramId ? String(data.telegramId) : String(data.tgId || "0"),
              fullName: data.fullName || data.firstName || "Guest",
              firstName: data.firstName || null,
              lastName: data.lastName || null,
              username: data.tgUsername || data.username || null,
              phoneNumber: data.phoneNumber || null,
              photoUrl: data.photoUrl || null,
              role: (data.role as "student" | "teacher" | "admin") || "student",
              language: (data.lang as "uz" | "ru" | "en") || "uz",
              createdAt: data.createdAt || new Date().toISOString(),
              token: null
            });
          }
        } catch (err) {
          console.error("Failed to fetch user in browser mode:", err);
        }
        if (mountedRef.current) setIsLoading(false);
        return;
      }

      // Telegram user found
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      const language = normalizeLanguage(user.language_code ?? null);

      try {
        await syncSession({
          telegramId: user.id,
          fullName: fullName || user.username || "Student",
          username: user.username ?? null,
          language,
          photoUrl: user.photo_url ?? null
        });
      } catch (error) {
        console.error("Settings sync error:", error);
      }

      if (mountedRef.current) setIsLoading(false);
    };

    void runSync();

    return () => {
      mountedRef.current = false;
    };
  }, [syncSession]);

  if (isLoading && !session) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  }

  // Fallback if session is still null but loading finished (shouldn't happen often, but safe)
  const displaySession = session || {
    fullName: "Guest User",
    username: "guest",
    role: "student",
    photoUrl: null,
    telegramId: "000000"
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans transition-colors duration-300">
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold mb-2">{t("settings.title", { defaultValue: "Settings" })}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle", { defaultValue: "Manage your preferences" })}</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Glass Profile Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand to-brand-gradient1 p-1 shadow-2xl shadow-brand/20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="relative flex flex-col items-center gap-4 rounded-[30px] bg-white/10 p-6 backdrop-blur-md">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-lg animate-pulse"></div>
              {displaySession.photoUrl ? (
                <img
                  src={displaySession.photoUrl}
                  alt={displaySession.fullName}
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
              <h3 className="text-xl font-bold">{displaySession.fullName}</h3>
              <p className="text-sm text-brand-light/80">@{displaySession.username || "username"}</p>
            </div>

            <div className="flex w-full gap-2">
              <div className="flex flex-1 flex-col items-center rounded-2xl bg-black/20 p-3 backdrop-blur-sm">
                <span className="text-xs font-medium text-brand-light/70">Role</span>
                <span className="font-bold text-white capitalize">{displaySession.role}</span>
              </div>
              <div className="flex flex-1 flex-col items-center rounded-2xl bg-black/20 p-3 backdrop-blur-sm">
                <span className="text-xs font-medium text-brand-light/70">ID</span>
                <span className="font-bold text-white font-mono text-xs mt-1">{displaySession.telegramId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin/Teacher Panel Button */}
        {(displaySession.role === "admin" || displaySession.role === "teacher") && (
          <button
            onClick={() => (window.location.href = "/admin")}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-sm hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Teacher Panel</h3>
                <p className="text-xs text-muted-foreground">Manage exams & students</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        {/* Appearance Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">Appearance</h3>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Language</span>
                </div>
              </div>
              <LanguageRadio />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="font-medium">Theme</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="space-y-4">
          <h3 className="px-2 text-sm font-bold uppercase tracking-wider text-text-secondary">Profile Settings</h3>

          <div className="overflow-hidden rounded-[24px] border border-border bg-surface/80 backdrop-blur-md shadow-sm p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <input
                type="text"
                defaultValue={displaySession.fullName}
                className="w-full rounded-xl border border-border bg-surface-alt px-4 py-3 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                placeholder="Enter your name"
              />
            </div>
            <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">Unit Quiz v1.0.0</p>
      </div>
    </div>
  );
};
