import { useTranslation } from "react-i18next";
import { useLanguageStore, type LanguageCode } from "@/store/useLanguage";

const LANGUAGES: { value: LanguageCode; label: string }[] = [
  { value: "uz", label: "O'zbekcha" },
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" }
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
    <fieldset className="flex flex-col gap-3 rounded-3xl bg-card/80 p-5 shadow-sm ring-1 ring-stroke">
      <legend className="text-sm font-semibold text-slate-100">Tilni tanlang</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {LANGUAGES.map((item) => (
          <label
            key={item.value}
            className="flex items-center justify-between gap-2 rounded-2xl border border-stroke bg-surface-2 px-4 py-3 text-sm text-slate-200 transition hover:border-brand"
          >
            <span>{item.label}</span>
            <input
              type="radio"
              name="language"
              value={item.value}
              checked={language === item.value}
              onChange={() => handleChange(item.value)}
              className="h-4 w-4 accent-brand"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
};
