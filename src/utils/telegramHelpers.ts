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

/**
 * Telegram WebApp metodunu güvenli şekilde çağırır
 */
export function safeCall<T extends keyof TelegramWebApp>(method: T, ...args: unknown[]): unknown {
  try {
    const wa = window.Telegram?.WebApp;
    if (typeof wa?.[method] === 'function') {
      // @ts-expect-error: dinamik çağrı
      return wa[method](...args);
    }
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Ürün için paylaşım linki oluşturur
 */
export function buildShareLink(prod: any) {
  const base = 'https://t.me/share/url';
  const url = encodeURIComponent(`https://notstore-contest.vercel.app/product/${prod.id}`);
  const txt = encodeURIComponent(`${prod.category} ${prod.name} – ${prod.price} ${prod.currency}`);
  return `${base}?url=${url}&text=${txt}`;
}

/**
 * Ürünü Telegram üzerinde paylaşır
 */
export function shareProduct(prod: any) {
  const link = buildShareLink(prod);

  // Bot API 8.1: openTelegramLink (preferred)
  if (canUse('openTelegramLink')) {
    safeCall('openTelegramLink', link); // non-blocking
  } else {
    // Works in every version ≥ 6 — opens in current window
    safeCall('openLink', link, { tryInstantView: false });
  }
}
