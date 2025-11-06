import { useTranslation } from "react-i18next";
import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ProfilePanel } from "@/components/settings/ProfilePanel";

export const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-text-primary">
          {t("settings.title", { defaultValue: "Sozlamalar" })}
        </h2>
        <p className="text-sm text-text-secondary">
          {t("settings.subtitle", {
            defaultValue: "Profilni moslang, tilni tanlang va rejimni o‘zgartiring."
          })}
        </p>
      </div>

      <ProfilePanel />
      <LanguageRadio />
      <ThemeToggle />
    </div>
  );
};
