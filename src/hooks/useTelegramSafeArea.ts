import { useEffect } from 'react';

export default function useTelegramSafeArea() {
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa?.onEvent) return;

    // Handler fonksiyonu, Telegram WebApp API'si unknown[] tipinde parametre bekliyor
    const handler = (...args: unknown[]) => {
      const safeAreaData = args[0] as { bottom?: number } | undefined;
      if (safeAreaData?.bottom !== undefined) {
        document.documentElement.style.setProperty(
          '--tg-safe-area-inset-bottom',
          `${safeAreaData.bottom}px`
        );
      }
    };

    // safe_area_changed eventi TG ≥ 8.0'da kullanılabilir
    wa.onEvent('safe_area_changed', handler);

    return () => wa.offEvent?.('safe_area_changed', handler);
  }, []);
}
