import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from 'axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // Handle mock tokens (for demo without backend)
        if (accessToken.startsWith('mock-jwt-token-')) {
          const mockUser = {
            id: 1,
            displayName: 'Admin User',
            email: 'admin@hrms.com',
            photoURL: '/assets/images/avatars/avatar_default.jpg',
            role: 'admin',
          };

          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: true,
              user: mockUser,
            },
          });
          return;
        }

        // If token is valid, use stored user data
        // Note: /api/auth/me endpoint would be better for fetching current user
        // For now, using localStorage to avoid API call on every page load
        const storedUser = window.localStorage.getItem('user');
        let user;

        if (storedUser) {
          try {
            user = JSON.parse(storedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            user = null;
          }
        }

        // Fallback to default user if no stored user
        if (!user) {
          user = {
            id: 1,
            displayName: 'Admin User',
            email: 'admin@hrms.com',
            photoURL: '/assets/images/avatars/avatar_default.jpg',
            role: 'admin',
            userType: 'super_admin',
          };
        }

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user: user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN - Uses database credentials (no hardcoded mock data)
  const login = useCallback(async (email, password) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { success, token, user, message } = response.data;

      if (!success) {
        throw new Error(message || 'Login failed');
      }

      // Set session with actual token from backend
      setSession(token);

      // Format user data for frontend
      const formattedUser = {
        id: user.id,
        displayName: user.name || `${user.email}`,
        email: user.email,
        photoURL: user.avatar || '/assets/images/avatars/avatar_default.jpg',
        role: user.userType || user.user_type || 'employee',
        userType: user.userType || user.user_type,
        status: user.status,
      };

      // Store user data in localStorage for persistence
      window.localStorage.setItem('user', JSON.stringify(formattedUser));

      dispatch({
        type: 'LOGIN',
        payload: {
          user: formattedUser,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Invalid email or password');
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: `${firstName} ${lastName}`,
        email,
        password,
        userType: 'employee',
      });

      const { success, token, user, message } = response.data;

      if (!success) {
        throw new Error(message || 'Registration failed');
      }

      // Set session with token
      setSession(token);

      // Format user data
      const formattedUser = {
        id: user.id,
        displayName: user.name,
        email: user.email,
        photoURL: user.avatar || '/assets/images/avatars/avatar_default.jpg',
        role: user.userType || 'employee',
        userType: user.userType,
        status: user.status,
      };

      // Store user data in localStorage for persistence
      window.localStorage.setItem('user', JSON.stringify(formattedUser));

      dispatch({
        type: 'REGISTER',
        payload: {
          user: formattedUser,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
