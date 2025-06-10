import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion, safeCall, canUse } from '../utils/telegramHelpers';

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
    if (tgVer >= 7.0 && canUse('requestFullscreen')) {
      if (!safeCall('requestFullscreen')) {
        // Fallback to expand
        safeCall('expand');
      }
    } else {
      // Eskiden beri var olan expand() metodunu kullan
      safeCall('expand');
    }

    /* --- transparent system bar --------------------------------------- */
    // setHeaderColor sadece Bot API 6.9+ destekler
    if (tgVer >= 6.9 && canUse('setHeaderColor')) {
      safeCall('setHeaderColor', '#00000000');
    }

    /* --- Back & Settings buttons (≥ 6.9) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton sadece Bot API 6.9+ destekler
    if (tgVer >= 6.9 && wa.BackButton) {
      try {
        if (isProduct && wa.BackButton.show) {
          wa.BackButton.show();
        } else if (wa.BackButton.hide) {
          wa.BackButton.hide();
        }

        if (canUse('onEvent')) {
          const onBack = () => nav(-1);
          wa.onEvent('back_button_pressed', onBack);

          cleanupFns.push(() => {
            if (wa.BackButton?.hide) wa.BackButton.hide();
            if (wa.offEvent) wa.offEvent('back_button_pressed', onBack);
          });
        }
      } catch {
        /* ignored */
      }
    }

    // SettingsButton sadece Bot API 6.9+ destekler
    if (tgVer >= 6.9 && wa.SettingsButton) {
      try {
        if (wa.SettingsButton.show) {
          wa.SettingsButton.show();
        }

        if (canUse('onEvent') && canUse('openLink')) {
          const openMenu = () => wa.openLink('https://t.me/notstore_bot');
          wa.onEvent('settings_button_pressed', openMenu);

          cleanupFns.push(() => {
            if (wa.SettingsButton?.hide) wa.SettingsButton.hide();
            if (wa.offEvent) wa.offEvent('settings_button_pressed', openMenu);
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
