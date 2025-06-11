// Telegram ortamını tespit eden yardımcı fonksiyon
export const isTelegram = (): boolean => Boolean(window.Telegram?.WebApp);
