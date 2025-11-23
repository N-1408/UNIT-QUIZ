import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";

const LANGUAGES: Array<{ value: LanguageCode; label: string; flag: string }> = [
  { value: "uz", label: "O'zbekcha", flag: "🇺🇿" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "en", label: "English", flag: "🇬🇧" }
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
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {LANGUAGES.map((item) => {
        const checked = language === item.value;
        return (
          <button
            key={item.value}
            onClick={() => handleChange(item.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-xl border p-2 transition-all duration-200",
              checked
                ? "border-brand bg-brand/10 text-brand shadow-sm"
                : "border-border/50 bg-card hover:bg-accent hover:border-border text-muted-foreground"
            )}
          >
            <span className="text-2xl filter drop-shadow-sm">{item.flag}</span>
            <span className={cn("text-xs font-medium", checked && "font-semibold")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
