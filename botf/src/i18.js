import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .use(LanguageDetector) // Automatically detects the user's language
  .use(HttpApi) // Loads translations from JSON files
  .init({
    fallbackLng: "en", // Default language
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to your translation files
    },
  });

export default i18n;
