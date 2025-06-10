import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion, safeCall } from '../utils/telegramHelpers';

export default function useTelegramHeader() {
  const tgVer = getTgVersion();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    wa.ready();

    /* --- fullscreen / expand ------------------------------------------ */
    // requestFullscreen sadece Bot API 7.0+ destekler
    if (tgVer >= 7.0) {
      if (!safeCall('requestFullscreen')) {
        // Fallback to expand
        safeCall('expand');
      }
    } else {
      // Eskiden beri var olan expand() metodunu kullan
      safeCall('expand');
    }

    /* --- transparent system bar --------------------------------------- */
    // setHeaderColor sadece Bot API 8.0+ destekler
    if (tgVer >= 8.0) {
      safeCall('setHeaderColor', '#00000000');
    }

    /* --- Back & Settings buttons (≥ 8.0) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton sadece Bot API 8.0+ destekler
    if (tgVer >= 8.0 && wa.BackButton) {
      try {
        if (isProduct && wa.BackButton.show) {
          wa.BackButton.show();
        } else if (wa.BackButton.hide) {
          wa.BackButton.hide();
        }

        // Event listener'ı güvenli şekilde ekle
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

    // SettingsButton sadece Bot API 8.0+ destekler
    if (tgVer >= 8.0 && wa.SettingsButton) {
      try {
        if (wa.SettingsButton.show) {
          wa.SettingsButton.show();
        }

        // Event listener'ı güvenli şekilde ekle
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
