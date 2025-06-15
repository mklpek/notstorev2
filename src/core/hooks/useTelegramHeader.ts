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

    console.log('📱 Telegram WebApp başlatılıyor...');
    wa.ready();
    console.log('✅ WebApp.ready() çağrıldı');

    /* --- Fullscreen / Expand ------------------------------------------ */
    // requestFullscreen only supported in Bot API 7.0+
    if (tgVer >= 7.0) {
      if (!safeCall('requestFullscreen')) {
        // Fallback to expand
        console.log('⚠️ requestFullscreen desteklenmiyor, expand kullanılıyor');
        safeCall('expand');
      } else {
        console.log('✅ requestFullscreen çağrıldı');
      }
    } else {
      // Use legacy expand() method for older versions
      console.log('⚠️ Eski Telegram sürümü, expand kullanılıyor');
      safeCall('expand');
    }

    /* --- Transparent System Bar --------------------------------------- */
    // setHeaderColor only supported in Bot API 8.0+
    if (tgVer >= 8.0) {
      console.log('✅ setHeaderColor çağrılıyor - şeffaf header');
      safeCall('setHeaderColor', '#00000000');
    }

    /* --- Safe Area Debugging ------------------------------------------ */
    console.log('📏 Safe Area Bilgileri:');
    if (wa.safeAreaInset) {
      console.log('Telegram safeAreaInset:', wa.safeAreaInset);
    } else {
      console.log('⚠️ Telegram safeAreaInset mevcut değil');
    }

    /* --- Back & Settings Buttons (≥ 8.0) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton only supported in Bot API 8.0+
    if (tgVer >= 8.0 && wa.BackButton) {
      try {
        if (isProduct && wa.BackButton.show) {
          wa.BackButton.show();
          console.log('✅ BackButton gösterildi');
        } else if (wa.BackButton.hide) {
          wa.BackButton.hide();
          console.log('ℹ️ BackButton gizlendi');
        }

        // Safely add event listener
        const onBack = () => nav(-1);
        if (safeCall('onEvent', 'back_button_pressed', onBack)) {
          console.log('✅ back_button_pressed event listener eklendi');
          cleanupFns.push(() => {
            if (wa.BackButton?.hide) wa.BackButton.hide();
            safeCall('offEvent', 'back_button_pressed', onBack);
          });
        }
      } catch (error) {
        console.log('❌ BackButton hatası:', error);
      }
    }

    // SettingsButton only supported in Bot API 8.0+
    if (tgVer >= 8.0 && wa.SettingsButton) {
      try {
        if (wa.SettingsButton.show) {
          wa.SettingsButton.show();
          console.log('✅ SettingsButton gösterildi');
        }

        // Safely add event listener
        const openMenu = () => safeCall('openLink', 'https://t.me/notstore_bot');
        if (safeCall('onEvent', 'settings_button_pressed', openMenu)) {
          console.log('✅ settings_button_pressed event listener eklendi');
          cleanupFns.push(() => {
            if (wa.SettingsButton?.hide) wa.SettingsButton.hide();
            safeCall('offEvent', 'settings_button_pressed', openMenu);
          });
        }
      } catch (error) {
        console.log('❌ SettingsButton hatası:', error);
      }
    }

    return () => {
      console.log('🧹 Header cleanup yapılıyor');
      cleanupFns.forEach(fn => fn());
    };
  }, [tgVer, pathname, nav]);
}
