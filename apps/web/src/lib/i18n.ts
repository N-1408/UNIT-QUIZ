import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "home.greet": "Hello, {{name}}! 👋",
      "home.subtitle": "Ready to master English today? Let's achieve your goals! 🚀",
      "exams.open": "OPEN - Tests available for you",
      "exam.start": "Start Exam",
      "settings.dark_on": "🌙 Dark mode enabled - comfortable reading!",
      "results.passed": "✅ Excellent work! You're making great progress. 🌟",
      "results.failed": "💪 Keep practicing! Every mistake is a learning opportunity."
    }
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
