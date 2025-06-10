import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion } from '../utils/telegramHelpers';

export default function useTelegramHeader() {
  const tgVer = getTgVersion();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    wa.ready();

    /* --- fullscreen / expand ------------------------------------------ */
    // requestFullscreen (Bot API 7.0+)
    if (wa.requestFullscreen && typeof wa.requestFullscreen === 'function') {
      try {
        wa.requestFullscreen();
      } catch {
        // Fallback to expand
        wa.expand();
      }
    } else {
      // Eskiden beri var olan expand() metodunu kullan
      wa.expand();
    }

    /* --- transparent system bar --------------------------------------- */
    // setHeaderColor (Bot API 6.9+)
    if (wa.setHeaderColor && typeof wa.setHeaderColor === 'function') {
      try {
        wa.setHeaderColor('#00000000');
      } catch {
        /* ignored */
      }
    }

    /* --- Back & Settings buttons (≥ 7.0) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton (Bot API 6.9+)
    if (wa.BackButton && wa.BackButton.show && wa.BackButton.hide) {
      try {
        if (isProduct) {
          wa.BackButton.show();
        } else {
          wa.BackButton.hide();
        }

        if (typeof wa.onEvent === 'function') {
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

    // SettingsButton (Bot API 6.9+)
    if (wa.SettingsButton && wa.SettingsButton.show) {
      try {
        wa.SettingsButton.show();

        if (typeof wa.onEvent === 'function' && typeof wa.openLink === 'function') {
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
