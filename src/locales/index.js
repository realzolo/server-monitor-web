import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next"
import i18n from "i18next"
import enTranslation from "./en.json"
import zhTranslation from "./zh.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "en": { translation: enTranslation },
      "zh-CN": { translation: zhTranslation }
    },
    fallbackLng: "en",
    supportedLngs: ["en", "zh-CN"],
    interpolation: { escapeValue: false }
  })

export default i18n;