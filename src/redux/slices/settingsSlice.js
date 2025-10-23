import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  general: {
    defaultLanguage: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24',
    timezone: 'UTC',
  },
  company: {
    name: 'HRMS Go V5',
    email: '',
    phone: '',
    address: '',
    website: '',
  },
  branding: {
    logoDark: null,
    logoLight: null,
    favicon: null,
    titleText: 'HRMS Go V5',
    footerText: '',
    themeColor: '#00AB55',
    customColor: null,
    sidebarVariant: 'default',
    layoutDirection: 'ltr',
    themeMode: 'light',
  },
  email: {
    driver: 'smtp',
    host: '',
    port: 587,
    username: '',
    password: '',
    encryption: 'tls',
    fromAddress: '',
    fromName: '',
  },
  storage: {
    driver: 'local',
    awsAccessKeyId: '',
    awsSecretAccessKey: '',
    awsBucket: '',
    awsRegion: '',
    wasabiAccessKeyId: '',
    wasabiSecretAccessKey: '',
    wasabiBucket: '',
    wasabiRegion: '',
    maxFileSize: 10485760, // 10MB
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
  },
  security: {
    recaptchaEnabled: false,
    recaptchaVersion: 'v2',
    recaptchaSiteKey: '',
    recaptchaSecretKey: '',
    twoFactorEnabled: false,
    sessionTimeout: 3600, // 1 hour
  },
  integrations: {
    openaiApiKey: '',
    deeplApiKey: '',
    enableAIFeatures: false,
    enableFaceRecognition: false,
  },
  subscription: {
    plan: 'free',
    features: {
      maxEmployees: 10,
      enableRecruitment: false,
      enablePayroll: false,
      enablePerformance: false,
      enableTraining: false,
      enableAssets: false,
      enableContracts: false,
      enableDocuments: true,
      enableMeetings: false,
      enableFaceLogin: false,
      enableAI: false,
    },
    expiresAt: null,
  },
  seo: {
    metaKeywords: '',
    metaDescription: '',
    metaImage: null,
  },
  cache: {
    enabled: true,
    ttl: 3600,
  },
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET SETTINGS SUCCESS
    getSettingsSuccess(state, action) {
      state.isLoading = false;
      state.general = { ...state.general, ...action.payload.general };
      state.company = { ...state.company, ...action.payload.company };
      state.branding = { ...state.branding, ...action.payload.branding };
      state.email = { ...state.email, ...action.payload.email };
      state.storage = { ...state.storage, ...action.payload.storage };
      state.security = { ...state.security, ...action.payload.security };
      state.integrations = { ...state.integrations, ...action.payload.integrations };
      state.subscription = { ...state.subscription, ...action.payload.subscription };
      state.seo = { ...state.seo, ...action.payload.seo };
      state.cache = { ...state.cache, ...action.payload.cache };
    },

    // UPDATE GENERAL SETTINGS
    updateGeneralSettings(state, action) {
      state.isLoading = false;
      state.general = { ...state.general, ...action.payload };
    },

    // UPDATE COMPANY SETTINGS
    updateCompanySettings(state, action) {
      state.isLoading = false;
      state.company = { ...state.company, ...action.payload };
    },

    // UPDATE BRANDING SETTINGS
    updateBrandingSettings(state, action) {
      state.isLoading = false;
      state.branding = { ...state.branding, ...action.payload };
    },

    // UPDATE EMAIL SETTINGS
    updateEmailSettings(state, action) {
      state.isLoading = false;
      state.email = { ...state.email, ...action.payload };
    },

    // UPDATE STORAGE SETTINGS
    updateStorageSettings(state, action) {
      state.isLoading = false;
      state.storage = { ...state.storage, ...action.payload };
    },

    // UPDATE SECURITY SETTINGS
    updateSecuritySettings(state, action) {
      state.isLoading = false;
      state.security = { ...state.security, ...action.payload };
    },

    // UPDATE INTEGRATIONS SETTINGS
    updateIntegrationsSettings(state, action) {
      state.isLoading = false;
      state.integrations = { ...state.integrations, ...action.payload };
    },

    // UPDATE SUBSCRIPTION SETTINGS
    updateSubscriptionSettings(state, action) {
      state.isLoading = false;
      state.subscription = { ...state.subscription, ...action.payload };
    },

    // UPDATE SUBSCRIPTION FEATURES
    updateSubscriptionFeatures(state, action) {
      state.isLoading = false;
      state.subscription.features = { ...state.subscription.features, ...action.payload };
    },

    // UPDATE SEO SETTINGS
    updateSEOSettings(state, action) {
      state.isLoading = false;
      state.seo = { ...state.seo, ...action.payload };
    },

    // UPDATE CACHE SETTINGS
    updateCacheSettings(state, action) {
      state.isLoading = false;
      state.cache = { ...state.cache, ...action.payload };
    },

    // CLEAR CACHE
    clearCacheSuccess(state) {
      state.isLoading = false;
    },

    // UPDATE THEME MODE
    updateThemeMode(state, action) {
      state.branding.themeMode = action.payload;
    },

    // UPDATE THEME COLOR
    updateThemeColor(state, action) {
      state.branding.themeColor = action.payload;
    },

    // UPDATE LAYOUT DIRECTION
    updateLayoutDirection(state, action) {
      state.branding.layoutDirection = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  getSettingsSuccess,
  updateGeneralSettings,
  updateCompanySettings,
  updateBrandingSettings,
  updateEmailSettings,
  updateStorageSettings,
  updateSecuritySettings,
  updateIntegrationsSettings,
  updateSubscriptionSettings,
  updateSubscriptionFeatures,
  updateSEOSettings,
  updateCacheSettings,
  clearCacheSuccess,
  updateThemeMode,
  updateThemeColor,
  updateLayoutDirection,
} = slice.actions;

// Selectors
export const selectSettings = (state) => state.settings;
export const selectGeneralSettings = (state) => state.settings.general;
export const selectCompanySettings = (state) => state.settings.company;
export const selectBrandingSettings = (state) => state.settings.branding;
export const selectEmailSettings = (state) => state.settings.email;
export const selectStorageSettings = (state) => state.settings.storage;
export const selectSecuritySettings = (state) => state.settings.security;
export const selectIntegrationsSettings = (state) => state.settings.integrations;
export const selectSubscriptionSettings = (state) => state.settings.subscription;
export const selectSubscriptionFeatures = (state) => state.settings.subscription.features;
export const selectSEOSettings = (state) => state.settings.seo;
export const selectThemeMode = (state) => state.settings.branding.themeMode;
export const selectThemeColor = (state) => state.settings.branding.themeColor;
export const selectLayoutDirection = (state) => state.settings.branding.layoutDirection;

