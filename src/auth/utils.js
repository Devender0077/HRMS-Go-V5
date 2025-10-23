// routes
import { PATH_AUTH } from '../routes/paths';
// utils
import axios from '../utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  // Handle mock tokens (for demo without backend)
  if (!token || token.startsWith('mock-jwt-token-')) {
    return {
      exp: Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60), // 3 days from now
      iat: Math.floor(Date.now() / 1000),
    };
  }

  const base64Url = token.split('.')[1];
  if (!base64Url) {
    // Invalid token format, return mock data
    return {
      exp: Math.floor(Date.now() / 1000) + (3 * 24 * 60 * 60),
      iat: Math.floor(Date.now() / 1000),
    };
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  // Mock tokens are always valid (for demo)
  if (accessToken.startsWith('mock-jwt-token-')) {
    return true;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('accessToken');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken); // ~3 days by minimals server
    tokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');

    delete axios.defaults.headers.common.Authorization;
  }
};
