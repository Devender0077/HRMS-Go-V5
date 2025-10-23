// routes
// import { PATH_DASHBOARD } from './routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API_KEY = process.env.REACT_APP_HOST_API_KEY || '';
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

// HRMS Configuration
// ----------------------------------------------------------------------

export const APP_NAME = process.env.REACT_APP_NAME || 'HRMS Go V5';
export const APP_VERSION = process.env.REACT_APP_VERSION || '5.0.0';

// DeepL Translation API
export const DEEPL_API = {
  apiKey: process.env.REACT_APP_DEEPL_API_KEY || '',
  apiUrl: process.env.REACT_APP_DEEPL_API_URL || 'https://api.deepl.com/v2',
};

// OpenAI Configuration
export const OPENAI_API = {
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
};

// Face Recognition Configuration
export const FACE_RECOGNITION = {
  enabled: process.env.REACT_APP_FACE_RECOGNITION_ENABLED === 'true',
  confidenceThreshold: parseFloat(process.env.REACT_APP_FACE_RECOGNITION_CONFIDENCE_THRESHOLD || '0.6'),
};

// Storage Configuration
export const STORAGE_CONFIG = {
  driver: process.env.REACT_APP_STORAGE_DRIVER || 'local',
  aws: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
    bucket: process.env.REACT_APP_AWS_BUCKET || '',
    region: process.env.REACT_APP_AWS_REGION || '',
  },
  wasabi: {
    accessKeyId: process.env.REACT_APP_WASABI_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_WASABI_SECRET_ACCESS_KEY || '',
    bucket: process.env.REACT_APP_WASABI_BUCKET || '',
    region: process.env.REACT_APP_WASABI_REGION || '',
  },
};

// Feature Flags
export const FEATURE_FLAGS = {
  enableAIFeatures: process.env.REACT_APP_ENABLE_AI_FEATURES === 'true',
  enableFaceLogin: process.env.REACT_APP_ENABLE_FACE_LOGIN === 'true',
  enableRecruitment: process.env.REACT_APP_ENABLE_RECRUITMENT === 'true',
  enablePayroll: process.env.REACT_APP_ENABLE_PAYROLL === 'true',
  enableAttendance: process.env.REACT_APP_ENABLE_ATTENDANCE === 'true',
  enablePerformance: process.env.REACT_APP_ENABLE_PERFORMANCE === 'true',
  enableTraining: process.env.REACT_APP_ENABLE_TRAINING === 'true',
  enableAssets: process.env.REACT_APP_ENABLE_ASSETS === 'true',
  enableContracts: process.env.REACT_APP_ENABLE_CONTRACTS === 'true',
  enableDocuments: process.env.REACT_APP_ENABLE_DOCUMENTS === 'true',
  enableMeetings: process.env.REACT_APP_ENABLE_MEETINGS === 'true',
  enableCalendar: process.env.REACT_APP_ENABLE_CALENDAR === 'true',
};

// Language Configuration
export const LANGUAGE_CONFIG = {
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE || 'en',
  supportedLanguages: (process.env.REACT_APP_SUPPORTED_LANGUAGES || 'en').split(','),
};

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = '/dashboard/app'; // Default dashboard page

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 92,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 260,
  W_DASHBOARD: 280,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
