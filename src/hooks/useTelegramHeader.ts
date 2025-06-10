import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTgVersion } from '../utils/telegramHelpers';

export default function useTelegramHeader() {
  const tgVer = getTgVersion(); // 6, 7, 8 vs.
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    wa.ready();

    /* --- fullscreen / expand ------------------------------------------ */
    try {
      if (tgVer >= 7 && typeof wa.requestFullscreen === 'function') {
        wa.requestFullscreen(); // 7.0'da eklendi
      } else {
        wa.expand();
      }
    } catch {
      /* ignored */
    }

    /* --- transparent system bar --------------------------------------- */
    try {
      if (tgVer >= 6.9 && typeof wa.setHeaderColor === 'function') {
        wa.setHeaderColor('#00000000'); // Docs ARGB formatı öneriyor
      }
    } catch {
      /* ignored */
    }

    /* --- Back & Settings buttons (≥ 7.0) ------------------------------ */
    const isProduct = pathname.startsWith('/product/');
    const cleanupFns: (() => void)[] = [];

    // BackButton
    try {
      if (tgVer >= 7 && wa.BackButton) {
        if (isProduct) {
          wa.BackButton.show();
        } else {
          wa.BackButton.hide();
        }
        const onBack = () => nav(-1);
        if (typeof wa.onEvent === 'function') {
          wa.onEvent('back_button_pressed', onBack);
        }
        cleanupFns.push(() => {
          if (wa.BackButton && typeof wa.BackButton.hide === 'function') {
            wa.BackButton.hide();
          }
          if (typeof wa.offEvent === 'function') {
            wa.offEvent('back_button_pressed', onBack);
          }
        });
      }
    } catch {
      /* ignored */
    }

    // SettingsButton
    try {
      if (tgVer >= 7 && wa.SettingsButton) {
        if (typeof wa.SettingsButton.show === 'function') {
          wa.SettingsButton.show();
        }
        const openMenu = () => {
          if (typeof wa.openLink === 'function') {
            wa.openLink('https://t.me/notstore_bot');
          }
        };
        if (typeof wa.onEvent === 'function') {
          wa.onEvent('settings_button_pressed', openMenu);
        }
        cleanupFns.push(() => {
          if (wa.SettingsButton && typeof wa.SettingsButton.hide === 'function') {
            wa.SettingsButton.hide();
          }
          if (typeof wa.offEvent === 'function') {
            wa.offEvent('settings_button_pressed', openMenu);
          }
        });
      }
    } catch {
      /* ignored */
    }

    // Tüm temizleme fonksiyonlarını döndür
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [tgVer, pathname, nav]);
}
