import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// redux
import { useDispatch } from 'react-redux';
import { loginSuccess as reduxLoginSuccess, logout as reduxLogout } from '../redux/slices/authSlice';
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
  const reduxDispatch = useDispatch(); // Add Redux dispatch

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
            permissions: [], // Will be loaded below
          };
        }

        // Load permissions from localStorage if not in user object
        if (!user.permissions || user.permissions.length === 0) {
          const storedPermissions = window.localStorage.getItem('permissions');
          if (storedPermissions) {
            try {
              user.permissions = JSON.parse(storedPermissions);
            } catch (e) {
              user.permissions = [];
            }
          }
        }

        // Dispatch to local context
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user: user,
          },
        });

        // ALSO dispatch to Redux store
        reduxDispatch(reduxLoginSuccess({
          user: user,
          token: accessToken,
          refreshToken: null,
        }));
        
        console.log('📤 [INIT] Loaded user into both Context and Redux state');
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
  }, [storageAvailable, reduxDispatch]);

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

      // Fetch user's role and permissions
      let userPermissions = [];
      let userRoleData = null;
      
      try {
        console.log('🔍 [LOGIN] Fetching user details for user ID:', user.id);
        
        // Get full user details including role_id
        const userDetailsResponse = await axios.get(`${API_URL}/users/${user.id}`);
        const userDetails = userDetailsResponse.data.data;
        
        console.log('✓ [LOGIN] User details:', {
          id: userDetails.id,
          email: userDetails.email,
          role_id: userDetails.role_id
        });
        
        if (userDetails.role_id) {
          console.log('🔍 [LOGIN] Fetching role data for role ID:', userDetails.role_id);
          
          // Get role with permissions
          const roleResponse = await axios.get(`${API_URL}/roles/${userDetails.role_id}`);
          const roleData = roleResponse.data.data;
          
          console.log('✓ [LOGIN] Role data:', {
            id: roleData.id,
            name: roleData.name,
            slug: roleData.slug,
            permissionsCount: roleData.permissions?.length || 0
          });
          
          if (roleData.permissions) {
            userPermissions = roleData.permissions.map(p => p.slug);
            userRoleData = {
              id: roleData.id,
              name: roleData.name,
              slug: roleData.slug,
            };
            
            console.log('✅ [LOGIN] Permissions loaded:', userPermissions.length);
            console.log('   First 10:', userPermissions.slice(0, 10));
          } else {
            console.warn('⚠️ [LOGIN] Role has NO permissions array!');
          }
        } else {
          console.warn('⚠️ [LOGIN] User has NO role_id!');
        }
      } catch (permError) {
        console.error('❌ [LOGIN] Error fetching permissions:', permError);
        console.error('   Response:', permError.response?.data);
        // Continue login even if permissions fail
      }

      // Format user data for frontend
      const formattedUser = {
        id: user.id,
        displayName: user.name || `${user.email}`,
        email: user.email,
        photoURL: user.avatar || '/assets/images/avatars/avatar_default.jpg',
        role: user.userType || user.user_type || 'employee',
        userType: user.userType || user.user_type,
        status: user.status,
        permissions: userPermissions,
        roleData: userRoleData,
      };

      // Store user data in localStorage for persistence
      window.localStorage.setItem('user', JSON.stringify(formattedUser));
      window.localStorage.setItem('permissions', JSON.stringify(userPermissions));

      console.log('💾 [LOGIN] Stored in localStorage:');
      console.log('   User:', formattedUser.email);
      console.log('   Permissions:', userPermissions.length);
      console.log('✅ [LOGIN] Login complete!');

      // Dispatch to local context reducer
      dispatch({
        type: 'LOGIN',
        payload: {
          user: formattedUser,
        },
      });

      // ALSO dispatch to Redux store
      reduxDispatch(reduxLoginSuccess({
        user: formattedUser,
        token: accessToken,
        refreshToken: refreshToken,
      }));
      
      console.log('📤 [LOGIN] Dispatched to both Context and Redux state');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Invalid email or password');
    }
  }, [reduxDispatch]);

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
    
    // Dispatch to local context
    dispatch({
      type: 'LOGOUT',
    });
    
    // ALSO dispatch to Redux store
    reduxDispatch(reduxLogout());
    
    console.log('📤 [LOGOUT] Cleared both Context and Redux state');
  }, [reduxDispatch]);

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
