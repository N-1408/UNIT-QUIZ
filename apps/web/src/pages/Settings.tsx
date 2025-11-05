import { LanguageRadio } from "@/components/settings/LanguageRadio";
import { ThemeToggle } from "@/components/settings/ThemeToggle";
import { ProfilePanel } from "@/components/settings/ProfilePanel";

export const SettingsPage = () => (
  <div className="flex flex-col gap-6">
    <ProfilePanel />
    <LanguageRadio />
    <ThemeToggle />
  </div>
);
