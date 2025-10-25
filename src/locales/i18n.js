import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
// utils
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { defaultLang, allLangs } from './config-lang';
//
import enLocales from './langs/en';

// Import all language files
const resources = {
  en: { translations: enLocales },
  ar: { translations: enLocales }, // Will be translated via DeepL
  da: { translations: enLocales },
  de: { translations: enLocales },
  es: { translations: enLocales },
  fr: { translations: enLocales },
  it: { translations: enLocales },
  ja: { translations: enLocales },
  nl: { translations: enLocales },
  pl: { translations: enLocales },
  ru: { translations: enLocales },
  pt: { translations: enLocales },
  zh: { translations: enLocales },
  tr: { translations: enLocales },
  he: { translations: enLocales },
  'pt-BR': { translations: enLocales },
};

// ----------------------------------------------------------------------

let lng = defaultLang.value;

const storageAvailable = localStorageAvailable();

if (storageAvailable) {
  lng = localStorage.getItem('i18nextLng') || defaultLang.value;
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng,
    fallbackLng: defaultLang.value,
    debug: false,
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Function to dynamically load translations using DeepL
export const loadTranslations = async (language) => {
  if (language === 'en') {
    return enLocales;
  }

  try {
    // Try to load from local storage first
    const cachedTranslations = localStorage.getItem(`translations_${language}`);
    if (cachedTranslations) {
      return JSON.parse(cachedTranslations);
    }

    // If not cached, use DeepL to translate
    // This would be called from a service/API endpoint
    return enLocales; // Fallback to English
  } catch (error) {
    console.error(`Error loading translations for ${language}:`, error);
    return enLocales;
  }
};

// Update document direction based on language
export const updateDirection = (langCode) => {
  const lang = allLangs.find((l) => l.value === langCode);
  if (lang && lang.direction) {
    document.documentElement.dir = lang.direction;
    document.documentElement.lang = langCode;
  }
};

// Initialize direction on load
updateDirection(lng);

export default i18n;
