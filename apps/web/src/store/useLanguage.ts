import { create } from "zustand";

export type LanguageCode = "uz" | "ru" | "en";

type LanguageState = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "uz",
  setLanguage: (language) => set({ language })
}));
