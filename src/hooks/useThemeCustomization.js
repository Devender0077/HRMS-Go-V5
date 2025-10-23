import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
// redux
import {
  selectBrandingSettings,
  updateThemeMode,
  updateThemeColor,
  updateLayoutDirection,
} from '../redux/slices/hrms/settingsSlice';
// components
import { useSettingsContext } from '../components/settings';

// ----------------------------------------------------------------------

export default function useThemeCustomization() {
  const dispatch = useDispatch();
  const brandingSettings = useSelector(selectBrandingSettings);
  const { onChangeMode, onChangeDirection, onChangeColor } = useSettingsContext();

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = useCallback(() => {
    const newMode = brandingSettings.themeMode === 'light' ? 'dark' : 'light';
    dispatch(updateThemeMode(newMode));
    onChangeMode({ target: { value: newMode } });
  }, [brandingSettings.themeMode, dispatch, onChangeMode]);

  /**
   * Set theme mode
   */
  const setThemeMode = useCallback(
    (mode) => {
      dispatch(updateThemeMode(mode));
      onChangeMode({ target: { value: mode } });
    },
    [dispatch, onChangeMode]
  );

  /**
   * Toggle RTL/LTR
   */
  const toggleDirection = useCallback(() => {
    const newDirection = brandingSettings.layoutDirection === 'ltr' ? 'rtl' : 'ltr';
    dispatch(updateLayoutDirection(newDirection));
    onChangeDirection({ target: { value: newDirection } });
    
    // Update document direction
    document.documentElement.dir = newDirection;
  }, [brandingSettings.layoutDirection, dispatch, onChangeDirection]);

  /**
   * Set layout direction
   */
  const setDirection = useCallback(
    (direction) => {
      dispatch(updateLayoutDirection(direction));
      onChangeDirection({ target: { value: direction } });
      document.documentElement.dir = direction;
    },
    [dispatch, onChangeDirection]
  );

  /**
   * Set theme color
   */
  const setThemeColor = useCallback(
    (color) => {
      dispatch(updateThemeColor(color));
      onChangeColor({ target: { value: color } });
    },
    [dispatch, onChangeColor]
  );

  /**
   * Check if dark mode
   */
  const isDarkMode = brandingSettings.themeMode === 'dark';

  /**
   * Check if RTL
   */
  const isRTL = brandingSettings.layoutDirection === 'rtl';

  return {
    // Current settings
    themeMode: brandingSettings.themeMode,
    themeColor: brandingSettings.themeColor,
    layoutDirection: brandingSettings.layoutDirection,
    isDarkMode,
    isRTL,

    // Actions
    toggleDarkMode,
    setThemeMode,
    toggleDirection,
    setDirection,
    setThemeColor,
  };
}

