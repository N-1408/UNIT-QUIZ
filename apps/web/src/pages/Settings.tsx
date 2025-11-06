import { useTranslation } from "react-i18next";
import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ProfilePanel } from "@/components/settings/ProfilePanel";
import { PageContainer } from "@/components/layout/Page";

export const SettingsPage = () => {
  const { t } = useTranslation();

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
