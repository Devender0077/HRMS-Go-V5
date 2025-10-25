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
    icon: '/assets/icons/flags/ic_flag_dk.svg', // ✅ Denmark flag
    direction: 'ltr',
  },
  {
    label: 'German',
    value: 'de',
    systemValue: deDE,
    icon: '/assets/icons/flags/ic_flag_de.svg', // ✅ Germany flag
    direction: 'ltr',
  },
  {
    label: 'Spanish',
    value: 'es',
    systemValue: esES,
    icon: '/assets/icons/flags/ic_flag_es.svg', // ✅ Spain flag
    direction: 'ltr',
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: frFR,
    icon: '/assets/icons/flags/ic_flag_fr.svg', // ✅ France flag
    direction: 'ltr',
  },
  {
    label: 'Italian',
    value: 'it',
    systemValue: itIT,
    icon: '/assets/icons/flags/ic_flag_it.svg', // ✅ Italy flag
    direction: 'ltr',
  },
  {
    label: 'Japanese',
    value: 'ja',
    systemValue: jaJP,
    icon: '/assets/icons/flags/ic_flag_jp.svg', // ✅ Japan flag
    direction: 'ltr',
  },
  {
    label: 'Dutch',
    value: 'nl',
    systemValue: nlNL,
    icon: '/assets/icons/flags/ic_flag_nl.svg', // ✅ Netherlands flag
    direction: 'ltr',
  },
  {
    label: 'Polish',
    value: 'pl',
    systemValue: plPL,
    icon: '/assets/icons/flags/ic_flag_pl.svg', // ✅ Poland flag
    direction: 'ltr',
  },
  {
    label: 'Russian',
    value: 'ru',
    systemValue: ruRU,
    icon: '/assets/icons/flags/ic_flag_ru.svg', // ✅ Russia flag
    direction: 'ltr',
  },
  {
    label: 'Portuguese',
    value: 'pt',
    systemValue: ptPT,
    icon: '/assets/icons/flags/ic_flag_pt.svg', // ✅ Portugal flag
    direction: 'ltr',
  },
  {
    label: 'Chinese',
    value: 'zh',
    systemValue: zhCN,
    icon: '/assets/icons/flags/ic_flag_cn.svg', // ✅ China flag
    direction: 'ltr',
  },
  {
    label: 'Turkish',
    value: 'tr',
    systemValue: trTR,
    icon: '/assets/icons/flags/ic_flag_tr.svg', // ✅ Turkey flag
    direction: 'ltr',
  },
  {
    label: 'Hebrew',
    value: 'he',
    systemValue: heIL,
    icon: '/assets/icons/flags/ic_flag_il.svg', // ✅ Israel flag
    direction: 'rtl',
  },
  {
    label: 'Portuguese (Brazil)',
    value: 'pt-BR',
    systemValue: ptBR,
    icon: '/assets/icons/flags/ic_flag_br.svg', // ✅ Brazil flag
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
