// Telegram Web Apps API v8 için contentSafeAreaInset ve content_safe_area_changed özelliklerini ekliyoruz

declare global {
  interface TelegramWebApp {
    /** Bot API 8.0 ile eklendi – Telegram UI elementlerini içeren güvenli alan */
    contentSafeAreaInset?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }

  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp &
        WebApp & {
          /** Content safe area değiştiğinde tetiklenen olay */
          onEvent?: (name: 'content_safe_area_changed', cb: (...args: unknown[]) => void) => void;
          offEvent?: (name: 'content_safe_area_changed', cb: (...args: unknown[]) => void) => void;
        };
    };
  }
}

export {};
