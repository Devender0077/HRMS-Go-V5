// @mui
import {
  enUS,
  frFR,
  zhCN,
  arSA,
  deDE,
  esES,
  itIT,
  jaJP,
  nlNL,
  plPL,
  ruRU,
  ptBR,
  trTR,
  heIL,
  daDK,
  ptPT,
} from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ✅ Exists
    direction: 'ltr',
  },
  {
    label: 'Arabic',
    value: 'ar',
    systemValue: arSA,
    icon: '/assets/icons/flags/ic_flag_sa.svg', // ✅ Exists
    direction: 'rtl',
  },
  {
    label: 'Danish',
    value: 'da',
    systemValue: daDK,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️  Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'German',
    value: 'de',
    systemValue: deDE,
    icon: '/assets/icons/flags/ic_flag_de.svg', // ✅ Exists
    direction: 'ltr',
  },
  {
    label: 'Spanish',
    value: 'es',
    systemValue: esES,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: frFR,
    icon: '/assets/icons/flags/ic_flag_fr.svg', // ✅ Exists
    direction: 'ltr',
  },
  {
    label: 'Italian',
    value: 'it',
    systemValue: itIT,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Japanese',
    value: 'ja',
    systemValue: jaJP,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Dutch',
    value: 'nl',
    systemValue: nlNL,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Polish',
    value: 'pl',
    systemValue: plPL,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Russian',
    value: 'ru',
    systemValue: ruRU,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Portuguese',
    value: 'pt',
    systemValue: ptPT,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Chinese',
    value: 'zh',
    systemValue: zhCN,
    icon: '/assets/icons/flags/ic_flag_cn.svg', // ✅ Exists
    direction: 'ltr',
  },
  {
    label: 'Turkish',
    value: 'tr',
    systemValue: trTR,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
  {
    label: 'Hebrew',
    value: 'he',
    systemValue: heIL,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'rtl',
  },
  {
    label: 'Portuguese (Brazil)',
    value: 'pt-BR',
    systemValue: ptBR,
    icon: '/assets/icons/flags/ic_flag_en.svg', // ⚠️ Using EN as fallback
    direction: 'ltr',
  },
];

export const defaultLang = allLangs[0]; // English

// RTL Languages
export const rtlLanguages = ['ar', 'he'];

// Get language by code
export const getLangByCode = (code) => allLangs.find((lang) => lang.value === code) || defaultLang;

// Check if language is RTL
export const isRTL = (langCode) => rtlLanguages.includes(langCode);
