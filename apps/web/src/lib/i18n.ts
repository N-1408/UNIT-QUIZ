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
      "results.failed": "💪 Keep practicing! Every mistake is a learning opportunity.",
      "exam.fullscreen_required": "Fullscreen Required",
      "exam.fullscreen_desc": "You must enter fullscreen mode to continue the exam.",
      "exam.enter_fullscreen": "Enter Fullscreen",
      "exam.warning": "Warning!",
      "exam.violation_desc": "You left the exam window or exited fullscreen.",
      "exam.understood": "I understand, continue",
      "exam.back": "Go Back"
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
      "results.failed": "💪 Mashq qilishda davom eting! Har bir xato - bu tajriba.",
      "exam.fullscreen_required": "To'liq ekran rejimi talab qilinadi",
      "exam.fullscreen_desc": "Imtihonni davom ettirish uchun to'liq ekran rejimiga o'tishingiz shart.",
      "exam.enter_fullscreen": "To'liq ekranga o'tish",
      "exam.warning": "Ogohlantirish!",
      "exam.violation_desc": "Siz imtihon oynasidan chiqdingiz yoki to'liq ekranni tark etdingiz.",
      "exam.understood": "Tushundim, davom etaman",
      "exam.back": "Ortga qaytish"
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
      "results.failed": "💪 Продолжайте практиковаться! Каждая ошибка - это опыт.",
      "exam.fullscreen_required": "Требуется полноэкранный режим",
      "exam.fullscreen_desc": "Вы должны перейти в полноэкранный режим, чтобы продолжить экзамен.",
      "exam.enter_fullscreen": "На весь экран",
      "exam.warning": "Внимание!",
      "exam.violation_desc": "Вы покинули окно экзамена или вышли из полноэкранного режима.",
      "exam.understood": "Я понял, продолжить",
      "exam.back": "Назад"
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
