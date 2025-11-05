import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      "home.greet": "Salom, {{name}}! 👋",
      "home.subtitle": "Bugun o'zingizni sinab ko'rasizmi yoki choy ichib dam olamizmi? ☕️",
      "exams.open": "OPEN - Qani ko'ramiz, kim yulduz ⭐️",
      "exam.start": "🚀 Boshlash",
      "settings.dark_on": "🌙 Ko'zingiz tinchroq bo'lishi uchun Dark Mode yoqildi!",
      "results.passed": "✅ Ajoyib! Yutuq qahvasi sizdan ☕️",
      "results.failed": "🙃 Xafa bo'lmang, bu faqat bir test xolos."
    }
  },
  ru: {
    translation: {
      "home.greet": "Привет, {{name}}! 👋",
      "home.subtitle": "Как насчет испытать себя или сделать перерыв на чай? ☕️",
      "exams.open": "OPEN - Посмотрим, кто у нас звезда ⭐️",
      "exam.start": "🚀 Начинаем",
      "settings.dark_on": "🌙 Тёмная тема включена - глазам легче!",
      "results.passed": "✅ Отлично! Победный кофе за тобой ☕️",
      "results.failed": "🙃 Не переживай, это всего лишь один тест."
    }
  },
  en: {
    translation: {
      "home.greet": "Hey, {{name}}! 👋",
      "home.subtitle": "Up for a challenge or shall we sip some tea instead? ☕️",
      "exams.open": "OPEN - Let's see who's the real star ⭐️",
      "exam.start": "🚀 Start",
      "settings.dark_on": "🌙 Dark mode on - your eyes can relax now!",
      "results.passed": "✅ Nicely done! Victory coffee is on you ☕️",
      "results.failed": "🙃 No worries, it's just a single test."
    }
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
