import { useEffect } from 'react';
import { getTgVersion } from '../utils/telegramHelpers';

export default function useSafeArea() {
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    // Versiyon kontrolü
    const tgVer = getTgVersion();

    // İlk değerler
    if (wa.viewportHeight) {
      document.documentElement.style.setProperty('--tg-viewport-height', `${wa.viewportHeight}px`);
    }

    // safeAreaInset v8.0+ ile geldi, kontrol et
    if (tgVer >= 8 && wa.safeAreaInset) {
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-bottom',
        `${wa.safeAreaInset.bottom ?? 0}px`
      );
    }

    // viewport_changed olayı dinleyicisi
    const handler = () => {
      if (wa.viewportHeight) {
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${wa.viewportHeight}px`
        );
      }

      if (tgVer >= 8 && wa.safeAreaInset) {
        document.documentElement.style.setProperty(
          '--tg-safe-area-inset-bottom',
          `${wa.safeAreaInset.bottom ?? 0}px`
        );
      }
    };

    try {
      if (tgVer >= 7 && typeof wa.onEvent === 'function') {
        wa.onEvent('viewport_changed', handler);
      }
    } catch {
      /* ignored */
    }

    return () => {
      try {
        if (tgVer >= 7 && typeof wa.offEvent === 'function') {
          wa.offEvent('viewport_changed', handler);
        }
      } catch {
        /* ignored */
      }
    };
  }, []);
}
