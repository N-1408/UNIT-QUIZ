import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";

const LANGUAGES: Array<{ value: LanguageCode; label: string }> = [
  { value: "uz", label: "O'zbekcha" },
  { value: "ru", label: "Ruscha" },
  { value: "en", label: "English" }
];

type LanguageRadioProps = {
  className?: string;
};

export const LanguageRadio = ({ className }: LanguageRadioProps) => {
  const { i18n } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleChange = (code: LanguageCode) => {
    setLanguage(code);
    void i18n.changeLanguage(code);
  };

  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      <legend className="text-xs font-semibold uppercase tracking-wide text-text-muted">Til</legend>
      <div className="grid grid-cols-3 gap-2">
        {LANGUAGES.map((item) => {
          const checked = language === item.value;
          return (
            <label
              key={item.value}
              className={cn(
                "flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition duration-swift ease-fluid",
                checked
                  ? "border-brand bg-brand-light text-brand"
                  : "border-border/70 bg-surface-alt text-text-secondary hover:border-brand/30 hover:text-text-primary"
              )}
            >
              <span>{item.label}</span>
              <input
                type="radio"
                name="language"
                value={item.value}
                checked={checked}
                onChange={() => handleChange(item.value)}
                className="sr-only"
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};
