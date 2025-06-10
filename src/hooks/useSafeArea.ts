import { useEffect } from 'react';
import { getTgVersion } from '../utils/telegramHelpers';

export default function useSafeArea() {
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    // Tek bir helper fonksiyon ile CSS değişkenini güncelleyelim
    const writeInset = (val: number) =>
      document.documentElement.style.setProperty('--tg-safe-area-inset-bottom', `${val}px`);

    // Viewport yüksekliğini ayarla (eski koddan)
    if (wa.viewportHeight) {
      document.documentElement.style.setProperty('--tg-viewport-height', `${wa.viewportHeight}px`);
    }

    // ❶ Native env() desteği - iOS/Android tarayıcıları
    try {
      const safeAreaBottomValue = getComputedStyle(document.documentElement).getPropertyValue(
        'env(safe-area-inset-bottom)'
      );

      if (safeAreaBottomValue) {
        const parsedValue = parseInt(safeAreaBottomValue, 10);
        if (!isNaN(parsedValue)) {
          writeInset(parsedValue);
        }
      }
    } catch {
      /* ignored */
    }

    // ❷ Telegram >= 8.0 dinamik event'i
    const tgVer = getTgVersion();

    // viewport_changed için handler (eski koddan)
    const viewportHandler = () => {
      if (wa.viewportHeight) {
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${wa.viewportHeight}px`
        );
      }
    };

    // safe_area_changed için handler
    const safeAreaHandler = (...args: unknown[]) => {
      const data = args[0] as { bottom?: number } | undefined;
      if (data?.bottom !== undefined) {
        writeInset(data.bottom);
      }
    };

    try {
      // viewport_changed eventi
      if (typeof wa.onEvent === 'function') {
        wa.onEvent('viewport_changed', viewportHandler);
      }

      // safe_area_changed eventi (TG >= 8.0)
      if (tgVer >= 8 && typeof wa.onEvent === 'function') {
        wa.onEvent('safe_area_changed', safeAreaHandler);
      }
    } catch {
      /* ignored */
    }

    return () => {
      try {
        if (typeof wa.offEvent === 'function') {
          wa.offEvent('viewport_changed', viewportHandler);
          // Sadece 8.0+ versiyonlarda çalışır
          if (tgVer >= 8) {
            wa.offEvent('safe_area_changed', safeAreaHandler);
          }
        }
      } catch {
        /* ignored */
      }
    };
  }, []);
}
