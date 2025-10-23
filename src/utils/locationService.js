// Service to get user's location and IP address

/**
 * Get user's current geolocation
 * @returns {Promise<object>} {latitude, longitude, location}
 */
export const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get address from coordinates using reverse geocoding
          const location = await getReverseGeocode(latitude, longitude);
          resolve({
            latitude,
            longitude,
            location,
          });
        } catch (error) {
          // If geocoding fails, return coords only
          resolve({
            latitude,
            longitude,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });

/**
 * Get address from coordinates using reverse geocoding
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<string>} Address string
 */
const getReverseGeocode = async (latitude, longitude) => {
  try {
    // Using OpenStreetMap Nominatim API (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await response.json();
    
    if (data && data.display_name) {
      // Return formatted address
      return data.display_name;
    }
    
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

/**
 * Get user's public IP address
 * @returns {Promise<string>} IP address
 */
export const getPublicIP = async () => {
  try {
    // Using ipify API (free)
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'Unknown';
  } catch (error) {
    console.error('IP fetch error:', error);
    
    // Fallback to ipapi.co
    try {
      const response2 = await fetch('https://ipapi.co/json/');
      const data2 = await response2.json();
      return data2.ip || 'Unknown';
    } catch (error2) {
      console.error('IP fetch error (fallback):', error2);
      return 'Unknown';
    }
  }
};

/**
 * Get device information
 * @returns {object} Device info
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let osName = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browserName = 'Internet Explorer';
  }

  // Detect OS
  if (userAgent.indexOf('Win') > -1) {
    osName = 'Windows';
  } else if (userAgent.indexOf('Mac') > -1) {
    osName = 'macOS';
  } else if (userAgent.indexOf('Linux') > -1) {
    osName = 'Linux';
  } else if (userAgent.indexOf('Android') > -1) {
    osName = 'Android';
  } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) {
    osName = 'iOS';
  }

  return {
    browser: browserName,
    os: osName,
    userAgent,
  };
};

/**
 * Get complete attendance tracking data
 * @returns {Promise<object>} {location, ip, deviceInfo}
 */
export const getAttendanceTrackingData = async () => {
  try {
    const [locationData, ipAddress] = await Promise.all([
      getCurrentLocation().catch(() => ({
        latitude: null,
        longitude: null,
        location: 'Location not available',
      })),
      getPublicIP().catch(() => 'Unknown'),
    ]);

    const deviceInfo = getDeviceInfo();

    return {
      ...locationData,
      ipAddress,
      deviceInfo: `${deviceInfo.browser} on ${deviceInfo.os}`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting attendance tracking data:', error);
    return {
      latitude: null,
      longitude: null,
      location: 'Error getting location',
      ipAddress: 'Unknown',
      deviceInfo: 'Unknown',
      timestamp: new Date().toISOString(),
    };
  }
};

