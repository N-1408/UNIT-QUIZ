import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";

const LANGUAGES: Array<{ value: LanguageCode; label: string; accent: string }> = [
  { value: "uz", label: "O'zbekcha", accent: "border-brand/40 bg-brand-light text-brand" },
  { value: "ru", label: "Ruscha", accent: "border-info/40 bg-info/10 text-info" },
  { value: "en", label: "English", accent: "border-accent-purple/40 bg-accent-purple/10 text-accent-purple" }
];

export const LanguageRadio = () => {
  const { i18n } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleChange = (code: LanguageCode) => {
    setLanguage(code);
    void i18n.changeLanguage(code);
  };

  return (
    <fieldset className="flex flex-col gap-3 rounded-[28px] border border-stroke/70 bg-surface p-5 shadow-elev-sm">
      <legend className="text-sm font-semibold text-text-primary">Tilni tanlang</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {LANGUAGES.map((item) => {
          const checked = language === item.value;
          return (
            <label
              key={item.value}
              className={cn(
                "flex items-center justify-between gap-2 rounded-[22px] border px-4 py-3 text-sm font-medium transition duration-swift ease-fluid",
                checked
                  ? item.accent
                  : "border-stroke/60 bg-surface-alt text-text-secondary hover:border-brand/30 hover:bg-surface"
              )}
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="language"
                value={item.value}
                checked={checked}
                onChange={() => handleChange(item.value)}
                className="h-4 w-4 accent-brand"
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
