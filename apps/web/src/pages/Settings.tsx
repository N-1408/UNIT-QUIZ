import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Switch from "../components/Switch";
import { getTheme, setTheme } from "../lib/theme";
import { haptic } from "../lib/tg";
import { useI18n, type Lang } from "../i18n";

const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const LANGUAGE_OPTIONS: Array<{ code: Lang; labelKey: string }> = [
  { code: "en", labelKey: "languageEnglishFlag" },
  { code: "uz", labelKey: "languageUzbekFlag" },
  { code: "ru", labelKey: "languageRussianFlag" }
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t, lang, setLang } = useI18n();
  const [dark, setDarkState] = useState(() => getTheme() === "dark");

  useEffect(() => {
    setTheme(dark ? "dark" : "light");
  }, [dark]);

  const handleLogout = async () => {
    haptic.tap();
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
    window.location.href = "/login";
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-4 pb-24">
      <h1 className="text-xl font-semibold">{t("settings")}</h1>

      <section className="card space-y-4 p-4">
        <h2 className="font-medium">{t("languageCardTitle")}</h2>
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

      <section className="card space-y-3 p-4">
        <h2 className="font-medium">{t("darkTheme")}</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--muted)]">{dark ? "Dark" : "Light"}</span>
          <Switch
            checked={dark}
            onChange={(value) => {
              haptic.tap();
              setDarkState(value);
            }}
            label="theme toggle"
          />
        </div>
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="font-medium">Account</h2>
        <p className="text-sm text-[var(--muted)]">Log out from this device.</p>
        <button type="button" className="btn btn-ghost tap w-full" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="font-medium">Teacher panel</h2>
        <p className="text-sm text-[var(--muted)]">Access the teacher tools.</p>
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

