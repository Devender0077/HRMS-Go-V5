import { useState, useEffect } from 'react';
import generalSettingsService from '../services/api/generalSettingsService';

/**
 * Custom hook to dynamically load week off settings from database
 * Returns the configured week off days (e.g., ['Saturday', 'Sunday'])
 * 
 * @param {boolean} refresh - Optional dependency to force reload
 * @returns {Object} { weekOffDays, loading, error, reload }
 */
export default function useWeekOffSettings(refresh = false) {
  const [weekOffDays, setWeekOffDays] = useState([]); // Start empty, load from DB
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let alive = true;

    const loadWeekOffSettings = async () => {
      setLoading(true);
      setError(null);
      
      console.log('🔄 [useWeekOffSettings] Starting to load settings for refresh:', refresh);
      
      try {
        const response = await generalSettingsService.getByCategory('attendance');
        
        console.log('📥 [useWeekOffSettings] API Response:', response);
        
        if (alive && response.success) {
          // API returns data in either 'data' or 'settings' field
          const settingsData = response.data || response.settings;
          
          console.log('🔍 [useWeekOffSettings] Settings data:', settingsData);
          
          if (settingsData) {
            const weekOffSetting = settingsData.week_off_days || settingsData.weekOffDays;
            
            console.log('🔍 [useWeekOffSettings] Week off setting from API:', weekOffSetting);
            
            if (weekOffSetting && typeof weekOffSetting === 'string' && weekOffSetting.trim() !== '') {
              // Parse comma-separated week off days
              const days = weekOffSetting.split(',').map(d => d.trim()).filter(Boolean);
              
              console.log('✅ [useWeekOffSettings] Parsed days:', days);
              setWeekOffDays(days);
              console.log('✅ [useWeekOffSettings] Week off days SET to:', days);
            } else {
              console.warn('⚠️ [useWeekOffSettings] Empty or invalid week off setting, setting to []');
              setWeekOffDays([]); // No week offs configured
            }
          } else {
            console.error('❌ [useWeekOffSettings] No settings data found in response:', response);
            setWeekOffDays([]);
          }
        } else {
          console.error('❌ [useWeekOffSettings] API response not successful:', response);
          // Use empty array if API fails
          setWeekOffDays([]);
        }
      } catch (err) {
        console.error('❌ [useWeekOffSettings] Failed to load week off settings:', err);
        if (alive) {
          setError(err.message);
          setWeekOffDays([]); // Use empty array on error
        }
      } finally {
        if (alive) {
          setLoading(false);
          console.log('✅ [useWeekOffSettings] Loading complete. Final weekOffDays:', weekOffDays);
        }
      }
    };

    loadWeekOffSettings();

    return () => {
      alive = false;
    };
  }, [refresh, reloadTrigger]); // weekOffDays removed from deps

  // Function to manually reload settings
  const reload = () => {
    setReloadTrigger(prev => prev + 1);
  };

  // Check if a given day name is a week off
  const isWeekOff = (dayName) => {
    return weekOffDays.includes(dayName);
  };

  // Check if a date is a week off
  const isWeekOffDate = (date) => {
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    return weekOffDays.includes(dayName);
  };

  return {
    weekOffDays,
    loading,
    error,
    reload,
    isWeekOff,
    isWeekOffDate,
  };
}

