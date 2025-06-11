/**
 * Uygulamanın Telegram Mini App içinde çalışıp çalışmadığını tespit eder
 * Localhost'ta false, Telegram içinde true döner
 */
export const isTelegram = (): boolean => Boolean(window.Telegram?.WebApp);
