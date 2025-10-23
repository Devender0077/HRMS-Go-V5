import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// Original slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';

// HRMS slices
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import attendanceReducer from './slices/attendanceSlice';
import leaveReducer from './slices/leaveSlice';
import payrollReducer from './slices/payrollSlice';
import recruitmentReducer from './slices/recruitmentSlice';
import settingsReducer from './slices/settingsSlice';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

export const authPersistConfig = {
  key: 'auth',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['isAuthenticated', 'user', 'token', 'refreshToken', 'permissions', 'role', 'faceRegistered'],
};

export const settingsPersistConfig = {
  key: 'settings',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['general', 'branding', 'subscription'],
};

const rootReducer = combineReducers({
  // Original reducers
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  
  // HRMS reducers
  auth: persistReducer(authPersistConfig, authReducer),
  employee: employeeReducer,
  attendance: attendanceReducer,
  leave: leaveReducer,
  payroll: payrollReducer,
  recruitment: recruitmentReducer,
  settings: persistReducer(settingsPersistConfig, settingsReducer),
});

export default rootReducer;
