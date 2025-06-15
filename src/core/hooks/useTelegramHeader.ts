/******************************************************************************
 * File: useTelegramHeader.ts
 * Layer: core
 * Desc: Telegram WebApp header management with version-aware API calls and navigation
 ******************************************************************************/

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion, safeCall } from '../utils/telegramHelpers';

/**
 * Handles theme changes and sends color commands to Telegram
 * @param isDark - Whether the theme is dark
 */
const handleTheme = (isDark: boolean) => {
  const bgColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';

  // Set theme data attribute
  document.body.dataset.theme = isDark ? 'dark' : 'light';

  // Update CSS variables
  document.documentElement.style.setProperty('--bg-color', bgColor);
  document.documentElement.style.setProperty('--text-color', textColor);

  // Send color commands to Telegram (Bot API 7.6+)
  const wa = window.Telegram?.WebApp;
  if (wa) {
    try {
      // Use postEvent for direct communication
      wa.postEvent?.('web_app_set_header_color', { color: bgColor });
      wa.postEvent?.('web_app_set_background_color', { color: bgColor });
      wa.postEvent?.('web_app_set_bottom_bar_color', { color: bgColor });
      console.log('🎨 Theme colors sent to Telegram:', { bgColor, textColor, isDark });
    } catch (error) {
      console.log('❌ Error setting Telegram colors:', error);
    }
  }
};

/**
 * Custom hook for managing Telegram WebApp header functionality
 * Handles fullscreen mode, transparent header, navigation buttons, and theme
 * Uses version-aware API calls for compatibility across Telegram versions
 * @returns void
 */
export default function useTelegramHeader() {
  const tgVer = getTgVersion();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    wa.ready();

    /* --- Theme Detection and Setup ------------------------------------ */
    // Detect theme from Telegram
    const isDark =
      wa.themeParams?.bg_color === '#000000' ||
      wa.themeParams?.bg_color === '#1c1c1e' ||
      !wa.themeParams?.bg_color; // Default to dark if no theme

    handleTheme(isDark);

    /* --- Fullscreen / Expand ------------------------------------------ */
    // requestFullscreen only supported in Bot API 7.0+
    if (tgVer >= 7.0) {
      if (!safeCall('requestFullscreen')) {
        // Fallback to expand
        safeCall('expand');
      }
    } else {
      // Use legacy expand() method for older versions
      safeCall('expand');
    }

    /* --- Header Color (No Padding) ------------------------------------ */
    // setHeaderColor only supported in Bot API 8.0+
    if (tgVer >= 8.0) {
      // Use theme-aware header color instead of transparent
      const headerColor = isDark ? '#000000' : '#ffffff';
      safeCall('setHeaderColor', headerColor);
    }

    /* --- Back & Settings Buttons (≥ 8.0) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton only supported in Bot API 8.0+
    if (tgVer >= 8.0 && wa.BackButton) {
      try {
        if (isProduct && wa.BackButton.show) {
          wa.BackButton.show();
        } else if (wa.BackButton.hide) {
          wa.BackButton.hide();
        }

        // Safely add event listener
        const onBack = () => nav(-1);
        if (safeCall('onEvent', 'back_button_pressed', onBack)) {
          cleanupFns.push(() => {
            if (wa.BackButton?.hide) wa.BackButton.hide();
            safeCall('offEvent', 'back_button_pressed', onBack);
          });
        }
      } catch {
        /* ignored */
      }
    }

    // SettingsButton only supported in Bot API 8.0+
    if (tgVer >= 8.0 && wa.SettingsButton) {
      try {
        if (wa.SettingsButton.show) {
          wa.SettingsButton.show();
        }

        // Safely add event listener
        const openMenu = () => safeCall('openLink', 'https://t.me/notstore_bot');
        if (safeCall('onEvent', 'settings_button_pressed', openMenu)) {
          cleanupFns.push(() => {
            if (wa.SettingsButton?.hide) wa.SettingsButton.hide();
            safeCall('offEvent', 'settings_button_pressed', openMenu);
          });
        }
      } catch {
        /* ignored */
      }
    }

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [tgVer, pathname, nav]);
}
