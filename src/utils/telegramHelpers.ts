/**
 * Mevcut Telegram WebApp versiyonunu tespit eder
 */
export function getTgVersion(): number {
  // Native uygulamalar WebApp.version gönderir (ör. '7.2')
  const waVer = window.Telegram?.WebApp?.version;
  if (waVer) return +waVer;

  // Web telegram tgWebAppVersion= parametresini URL'e ekler
  const qs = new URLSearchParams(window.location.search);
  const qsVer = qs.get('tgWebAppVersion');
  return qsVer ? +qsVer : 0;
}

/**
 * Belirli bir Telegram WebApp özelliğinin mevcut olup olmadığını kontrol eder
 */
export const canUse = (method: keyof TelegramWebApp, min = 7) =>
  Number(window.Telegram?.WebApp?.version ?? '6.0') >= min;
