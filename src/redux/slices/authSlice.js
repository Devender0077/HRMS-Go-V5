import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  loginMethod: 'traditional', // 'traditional' or 'face'
  faceRegistered: false,
  permissions: [],
  role: null,
};

const slice = createSlice({
  name: 'auth',
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

    // LOGIN SUCCESS
    loginSuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.permissions = action.payload.user.permissions || [];
      state.role = action.payload.user.role;
      state.loginMethod = action.payload.loginMethod || 'traditional';
      state.error = null;
    },

    // LOGOUT
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.permissions = [];
      state.role = null;
      state.loginMethod = 'traditional';
      state.faceRegistered = false;
      state.error = null;
    },

    // UPDATE USER
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
    },

    // SET FACE REGISTRATION STATUS
    setFaceRegistered(state, action) {
      state.faceRegistered = action.payload;
    },

    // SET LOGIN METHOD
    setLoginMethod(state, action) {
      state.loginMethod = action.payload;
    },

    // REFRESH TOKEN
    refreshTokenSuccess(state, action) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    // UPDATE PERMISSIONS
    updatePermissions(state, action) {
      state.permissions = action.payload;
    },

    // CHECK TOKEN EXPIRY
    checkTokenExpiry(state) {
      if (state.token) {
        try {
          const decoded = jwtDecode(state.token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.permissions = [];
            state.role = null;
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  hasError,
  loginSuccess,
  logout,
  updateUser,
  setFaceRegistered,
  setLoginMethod,
  refreshTokenSuccess,
  updatePermissions,
  checkTokenExpiry,
} = slice.actions;

// ----------------------------------------------------------------------

// Selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectPermissions = (state) => state.auth.permissions;
export const selectRole = (state) => state.auth.role;
export const selectLoginMethod = (state) => state.auth.loginMethod;
export const selectFaceRegistered = (state) => state.auth.faceRegistered;

