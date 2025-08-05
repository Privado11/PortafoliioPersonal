import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";


import commonES from "./locales/es/common.json";
import bannerES from "./locales/es/banner.json";
import projectsES from "./locales/es/projects.json";
import skillsES from "./locales/es/skills.json";
import contactES from "./locales/es/contact.json";

import commonEN from "./locales/en/common.json";
import bannerEN from "./locales/en/banner.json";
import projectsEN from "./locales/en/projects.json";
import skillsEN from "./locales/en/skills.json";
import contactEN from "./locales/en/contact.json";

const resources = {
  es: {
    common: commonES,
    banner: bannerES,
    projects: projectsES,
    skills: skillsES,
    contact: contactES,
  },
  en: {
    common: commonEN,
    banner: bannerEN,
    projects: projectsEN,
    skills: skillsEN,
    contact: contactEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "en",
    defaultNS: "common", 
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
