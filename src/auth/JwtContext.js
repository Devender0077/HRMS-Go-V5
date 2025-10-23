import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios from '../utils/axios';
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

        // Try to get user from API
        try {
          const response = await axios.get('/api/account/my-account');
          const { user } = response.data;

          dispatch({
            type: 'INITIAL',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } catch (apiError) {
          // If API fails but token is valid, use mock user
          if (isValidToken(accessToken)) {
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
          } else {
            throw apiError;
          }
        }
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
      console.error(error);
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

  // LOGIN
  const login = useCallback(async (email, password) => {
    // Mock login for demo (remove when backend is ready)
    if (email === 'admin@hrms.com' && password === 'admin123') {
      const mockUser = {
        id: 1,
        displayName: 'Admin User',
        email: 'admin@hrms.com',
        photoURL: '/assets/images/avatars/avatar_default.jpg',
        role: 'admin',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();

      setSession(mockToken);

      dispatch({
        type: 'LOGIN',
        payload: {
          user: mockUser,
        },
      });
      return;
    }

    // Try actual API call
    try {
      const response = await axios.post('/api/account/login', {
        email,
        password,
      });
      const { accessToken, user } = response.data;

      setSession(accessToken);

      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (error) {
      // If API fails and credentials match demo, use mock
      if (email === 'admin@hrms.com' && password === 'admin123') {
        const mockUser = {
          id: 1,
          displayName: 'Admin User',
          email: 'admin@hrms.com',
          photoURL: '/assets/images/avatars/avatar_default.jpg',
          role: 'admin',
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        setSession(mockToken);

        dispatch({
          type: 'LOGIN',
          payload: {
            user: mockUser,
          },
        });
      } else {
        throw error;
      }
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
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
