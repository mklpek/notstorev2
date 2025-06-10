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
 * Belirli bir Telegram WebApp metodunun desteklenip desteklenmediğini kontrol eder
 */
export function canUse(method: keyof TelegramWebApp): boolean {
  return typeof window.Telegram?.WebApp?.[method] === 'function';
}
