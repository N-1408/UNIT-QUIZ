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
  },
  uz: {
    translation: {
      "home.greet": "Salom, {{name}}! 👋",
      "home.subtitle": "Bugun ingliz tilini o'rganishga tayyormisiz? Maqsad sari olg'a! 🚀",
      "exams.open": "OCHIQ - Siz uchun mavjud testlar",
      "exam.start": "Imtihonni Boshlash",
      "settings.dark_on": "🌙 Tungi rejim yoqildi - o'qish uchun qulay!",
      "results.passed": "✅ Ajoyib natija! Siz katta o'sishga erishdingiz. 🌟",
      "results.failed": "💪 Mashq qilishda davom eting! Har bir xato - bu tajriba."
    }
  },
  ru: {
    translation: {
      "home.greet": "Привет, {{name}}! 👋",
      "home.subtitle": "Готовы освоить английский сегодня? Вперед к целям! 🚀",
      "exams.open": "ОТКРЫТО - Доступные тесты",
      "exam.start": "Начать Экзамен",
      "settings.dark_on": "🌙 Темная тема включена - удобно для глаз!",
      "results.passed": "✅ Отличная работа! Вы делаете большие успехи. 🌟",
      "results.failed": "💪 Продолжайте практиковаться! Каждая ошибка - это опыт."
    }
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
});

export default i18n;
