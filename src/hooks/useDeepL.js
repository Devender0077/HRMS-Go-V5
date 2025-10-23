import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import deeplService from '../services/deeplService';
import { updateDirection } from '../locales/i18n';
import { allLangs } from '../locales/config-lang';

// Custom hook for DeepL translations
export default function useDeepL() {
  const { i18n } = useTranslation();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  /**
   * Translate text using DeepL
   */
  const translate = useCallback(
    async (text, targetLang, sourceLang = 'en') => {
      setIsTranslating(true);
      setTranslationError(null);

      try {
        const translatedText = await deeplService.translate(text, targetLang, sourceLang);
        setIsTranslating(false);
        return translatedText;
      } catch (error) {
        setTranslationError(error.message);
        setIsTranslating(false);
        throw error;
      }
    },
    []
  );

  /**
   * Translate object using DeepL
   */
  const translateObject = useCallback(
    async (obj, targetLang, sourceLang = 'en') => {
      setIsTranslating(true);
      setTranslationError(null);

      try {
        const translatedObj = await deeplService.translateObject(obj, targetLang, sourceLang);
        setIsTranslating(false);
        return translatedObj;
      } catch (error) {
        setTranslationError(error.message);
        setIsTranslating(false);
        throw error;
      }
    },
    []
  );

  /**
   * Change language and update direction
   */
  const changeLanguage = useCallback(
    async (langCode) => {
      try {
        await i18n.changeLanguage(langCode);
        updateDirection(langCode);
        
        // Store in localStorage
        localStorage.setItem('i18nextLng', langCode);

        // Update HTML attributes
        const lang = allLangs.find((l) => l.value === langCode);
        if (lang) {
          document.documentElement.setAttribute('lang', langCode);
          document.documentElement.setAttribute('dir', lang.direction || 'ltr');
        }

        return true;
      } catch (error) {
        console.error('Error changing language:', error);
        return false;
      }
    },
    [i18n]
  );

  /**
   * Get current language
   */
  const getCurrentLanguage = useCallback(() => {
    const currentLang = i18n.language;
    return allLangs.find((lang) => lang.value === currentLang) || allLangs[0];
  }, [i18n.language]);

  /**
   * Check if current language is RTL
   */
  const isRTL = useCallback(() => {
    const currentLang = getCurrentLanguage();
    return currentLang.direction === 'rtl';
  }, [getCurrentLanguage]);

  /**
   * Get supported languages
   */
  const getSupportedLanguages = useCallback(async () => {
    try {
      const languages = await deeplService.getSupportedLanguages();
      return languages;
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return [];
    }
  }, []);

  /**
   * Get DeepL usage statistics
   */
  const getUsage = useCallback(async () => {
    try {
      const usage = await deeplService.getUsage();
      return usage;
    } catch (error) {
      console.error('Error getting usage:', error);
      return null;
    }
  }, []);

  /**
   * Translate and cache translations
   */
  const translateAndCache = useCallback(
    async (translations, targetLang) => {
      try {
        const cacheKey = `translations_${targetLang}`;
        
        // Check if already cached
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }

        // Translate using DeepL
        const translated = await translateObject(translations, targetLang, 'en');
        
        // Cache the translations
        localStorage.setItem(cacheKey, JSON.stringify(translated));
        
        return translated;
      } catch (error) {
        console.error('Error translating and caching:', error);
        return translations; // Return original on error
      }
    },
    [translateObject]
  );

  return {
    translate,
    translateObject,
    changeLanguage,
    getCurrentLanguage,
    isRTL,
    getSupportedLanguages,
    getUsage,
    translateAndCache,
    isTranslating,
    translationError,
    currentLanguage: i18n.language,
    allLanguages: allLangs,
  };
}

