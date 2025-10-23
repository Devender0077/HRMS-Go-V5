import axios from 'axios';
import { DEEPL_API } from '../config-global';

// DeepL Service for Translation
class DeepLService {
  constructor() {
    this.apiKey = DEEPL_API.apiKey;
    this.apiUrl = DEEPL_API.apiUrl;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `DeepL-Auth-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Translate text using DeepL API
   * @param {string|array} text - Text or array of texts to translate
   * @param {string} targetLang - Target language code
   * @param {string} sourceLang - Source language code (optional)
   * @returns {Promise} Translated text
   */
  async translate(text, targetLang, sourceLang = null) {
    try {
      const params = {
        text: Array.isArray(text) ? text : [text],
        target_lang: this.mapLanguageCode(targetLang).toUpperCase(),
      };

      if (sourceLang) {
        params.source_lang = this.mapLanguageCode(sourceLang).toUpperCase();
      }

      const response = await this.client.post('/translate', params);
      
      const translations = response.data.translations.map(t => t.text);
      return Array.isArray(text) ? translations : translations[0];
    } catch (error) {
      console.error('DeepL Translation Error:', error);
      throw error;
    }
  }

  /**
   * Translate JSON object recursively
   * @param {object} obj - Object to translate
   * @param {string} targetLang - Target language
   * @param {string} sourceLang - Source language
   * @returns {Promise} Translated object
   */
  async translateObject(obj, targetLang, sourceLang = 'en') {
    const translatedObj = {};
    const textsToTranslate = [];
    const keys = [];

    // Collect all text values
    const collectTexts = (object, prefix = '') => {
      Object.keys(object).forEach((key) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = object[key];

        if (typeof value === 'string') {
          textsToTranslate.push(value);
          keys.push(fullKey);
        } else if (typeof value === 'object' && value !== null) {
          collectTexts(value, fullKey);
        }
      });
    };

    collectTexts(obj);

    // Translate all texts at once (batch translation)
    if (textsToTranslate.length > 0) {
      const translations = await this.translate(textsToTranslate, targetLang, sourceLang);

      // Rebuild object with translations
      keys.forEach((key, index) => {
        const keyPath = key.split('.');
        let current = translatedObj;

        keyPath.forEach((k, i) => {
          if (i === keyPath.length - 1) {
            current[k] = translations[index];
          } else {
            current[k] = current[k] || {};
            current = current[k];
          }
        });
      });
    }

    return translatedObj;
  }

  /**
   * Map language codes to DeepL supported codes
   * @param {string} langCode - Language code
   * @returns {string} DeepL language code
   */
  mapLanguageCode(langCode) {
    const languageMap = {
      'en': 'EN',
      'ar': 'AR',      // Arabic
      'da': 'DA',      // Danish
      'de': 'DE',      // German
      'es': 'ES',      // Spanish
      'fr': 'FR',      // French
      'it': 'IT',      // Italian
      'ja': 'JA',      // Japanese
      'nl': 'NL',      // Dutch
      'pl': 'PL',      // Polish
      'ru': 'RU',      // Russian
      'pt': 'PT-PT',   // Portuguese
      'pt-BR': 'PT-BR', // Portuguese (Brazilian)
      'zh': 'ZH',      // Chinese
      'tr': 'TR',      // Turkish
      'he': 'HE',      // Hebrew (if supported)
    };

    return languageMap[langCode] || langCode.toUpperCase();
  }

  /**
   * Get supported languages from DeepL
   * @returns {Promise} List of supported languages
   */
  async getSupportedLanguages() {
    try {
      const response = await this.client.get('/languages');
      return response.data;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw error;
    }
  }

  /**
   * Check usage statistics
   * @returns {Promise} Usage statistics
   */
  async getUsage() {
    try {
      const response = await this.client.get('/usage');
      return response.data;
    } catch (error) {
      console.error('Error fetching usage stats:', error);
      throw error;
    }
  }
}

export default new DeepLService();

