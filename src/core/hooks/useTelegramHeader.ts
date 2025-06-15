/******************************************************************************
 * File: useTelegramHeader.ts
 * Layer: core
 * Desc: Telegram WebApp header management with version-aware API calls and navigation
 ******************************************************************************/

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion, safeCall } from '../utils/telegramHelpers';

/**
 * Custom hook for managing Telegram WebApp header functionality
 * Handles fullscreen mode, transparent header, and navigation buttons
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

    /* --- Transparent System Bar --------------------------------------- */
    if (tgVer >= 8.0) {
      // setHeaderColor only supported in Bot API 8.0+
      safeCall('setHeaderColor', '#00000000');
    } else {
      // Legacy transparent header for older versions (< 8.0)
      safeCall('expand');
      // Force transparent header using old API if available
      if (wa.HeaderColor && typeof wa.HeaderColor.setColor === 'function') {
        try {
          wa.HeaderColor.setColor('#00000000');
        } catch {
          /* ignored */
        }
      }
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
