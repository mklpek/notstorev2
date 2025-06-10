/**
 * Mevcut Telegram WebApp versiyonunu tespit eder
 */
export function getTgVersion(): number {
  try {
    // Native uygulamalar WebApp.version gönderir (ör. '7.2')
    const waVer = window.Telegram?.WebApp?.version;
    if (waVer) {
      const parsed = parseFloat(waVer);
      if (!isNaN(parsed)) return parsed;
    }

    // Web telegram tgWebAppVersion= parametresini URL'e ekler
    const qs = new URLSearchParams(window.location.search);
    const qsVer = qs.get('tgWebAppVersion');
    if (qsVer) {
      const parsed = parseFloat(qsVer);
      if (!isNaN(parsed)) return parsed;
    }

    // Fallback: eğer hiçbir versiyon bilgisi yoksa 6.0 varsayalım
    return 6.0;
  } catch {
    // Hata durumunda güvenli versiyon döndür
    return 6.0;
  }
}

/**
 * Belirli bir Telegram WebApp metodunun desteklenip desteklenmediğini kontrol eder
 */
export function canUse(method: keyof TelegramWebApp): boolean {
  try {
    return typeof window.Telegram?.WebApp?.[method] === 'function';
  } catch {
    return false;
  }
}

/**
 * Telegram WebApp metodunu güvenli şekilde çağırır
 */
export function safeCall<T extends keyof TelegramWebApp>(method: T, ...args: unknown[]): boolean {
  try {
    const wa = window.Telegram?.WebApp;
    if (!wa || typeof wa[method] !== 'function') return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wa[method] as any)(...args);
    return true;
  } catch {
    return false;
  }
}
