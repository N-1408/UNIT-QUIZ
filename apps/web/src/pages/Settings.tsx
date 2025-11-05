import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTheme, setTheme, type Theme } from "../lib/theme";
import { haptic } from "../lib/tg";
import { useI18n, type Lang } from "../i18n";
import { useCurrentUser } from "../hooks/useCurrentUser";

const LANGUAGE_OPTIONS: Array<{ code: Lang; labelKey: string }> = [
  { code: "en", labelKey: "languageEnglishFlag" },
  { code: "uz", labelKey: "languageUzbekFlag" },
  { code: "ru", labelKey: "languageRussianFlag" }
];

const THEME_OPTIONS: Array<{ value: Theme; label: string; description: string }> = [
  { value: "light", label: "Light mode", description: "Yorqin va quvnoq interfeys" },
  { value: "dark", label: "Dark mode", description: "Kechki rejim uchun qulay dizayn" }
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const { profile, telegramUser } = useCurrentUser();
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 pb-24">
      <header>
        <h1 className="section-title">{t("settings")}</h1>
        <div className="section-accent mt-1" />
      </header>

      <section className="card space-y-3 p-5">
        <h2 className="text-base font-semibold">Profil ma'lumotlari</h2>
        <p className="text-sm text-[var(--muted)]">
          Nova LC platformasi sizning Telegram profilingiz bilan moslashdi.
        </p>
        <div className="rounded-2xl border border-[var(--divider)] bg-[color-mix(in_oklab,_var(--fg)_4%,_transparent)] p-4 text-sm">
          <p className="font-medium" style={{ color: "var(--fg)" }}>
            {profile?.firstName} {profile?.lastName ?? ""}
          </p>
          {telegramUser?.username ? (
            <p className="mt-1 text-[var(--muted)]">@{telegramUser.username}</p>
          ) : null}
          <div className="mt-3 grid gap-2 text-xs text-[var(--muted)]">
            <p>
              <span className="font-medium text-[var(--fg)]">Telegram ID:</span> {profile?.telegramId ?? telegramUser?.id ?? "---"}
            </p>
            <p>
              <span className="font-medium text-[var(--fg)]">Telefon raqam:</span> {profile?.phoneNumber ?? "---"}
            </p>
          </div>
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-base font-semibold">{t("languageCardTitle")}</h2>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`pill tap ${lang === option.code ? "pill-active" : ""}`}
              onClick={() => {
                haptic.tap();
                setLang(option.code);
              }}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-base font-semibold">Tema</h2>
        <div className="grid gap-3">
          {THEME_OPTIONS.map((option) => {
            const active = theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-transparent bg-[linear-gradient(135deg,_var(--brand-primary),_var(--brand-secondary))] text-white shadow-[0_16px_32px_rgba(255,95,0,0.22)]"
                    : "border-[var(--divider)] bg-[var(--card)]"
                }`}
                onClick={() => {
                  haptic.tap();
                  setThemeState(option.value);
                }}
              >
                <div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p className={`text-xs ${active ? "text-white/80" : "text-[var(--muted)]"}`}>{option.description}</p>
                </div>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                    active ? "border-white bg-white/20" : "border-[var(--divider)]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      active ? "bg-white" : "bg-transparent"
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="text-base font-semibold">Teacher panel</h2>
        <p className="text-sm text-[var(--muted)]">Mentorlar uchun boshqaruv bo'limi.</p>
        <button
          type="button"
          className="btn btn-primary tap w-full"
          onClick={() => {
            haptic.tap();
            navigate("/teacher");
          }}
        >
          {t("openTeacher")}
        </button>
      </section>
    </div>
  );
}


