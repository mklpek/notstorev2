/******************************************************************************
 * File: telegramHelpers.ts
 * Layer: utils
 * Desc: Telegram WebApp utility functions for version detection and safe API calls
 ******************************************************************************/

/**
 * Detects current Telegram WebApp version
 * @returns Version number as float, defaults to 6.0 if not detected
 */
export function getTgVersion(): number {
  try {
    // Native apps send WebApp.version (e.g. '7.2')
    const waVer = window.Telegram?.WebApp?.version;
    if (waVer) {
      const parsed = parseFloat(waVer);
      if (!isNaN(parsed)) return parsed;
    }

    // Web telegram adds tgWebAppVersion= parameter to URL
    const qs = new URLSearchParams(window.location.search);
    const qsVer = qs.get('tgWebAppVersion');
    if (qsVer) {
      const parsed = parseFloat(qsVer);
      if (!isNaN(parsed)) return parsed;
    }

    // Fallback: if no version info available, assume 6.0
    return 6.0;
  } catch {
    // Return safe version in case of error
    return 6.0;
  }
}

/**
 * Checks if a specific Telegram WebApp method is supported
 * @param method - Method name to check for support
 * @returns True if method is available and callable
 */
export function canUse(method: keyof TelegramWebApp): boolean {
  try {
    return typeof window.Telegram?.WebApp?.[method] === 'function';
  } catch {
    return false;
  }
}

/**
 * Safely calls Telegram WebApp method - Telegram 2.0 API compatible
 * Cleans up console warnings and provides type safety
 * @param method - Method name to call
 * @param args - Arguments to pass to the method
 * @returns Method result or undefined if method unavailable
 */
export function safeCall<T extends keyof TelegramWebApp>(method: T, ...args: unknown[]): unknown {
  try {
    const wa = window.Telegram?.WebApp;

    // Is function defined and typeof === 'function'?
    if (typeof wa?.[method] === 'function') {
      // @ts-expect-error: dynamic call - inherent nature of Telegram API
      return wa[method](...args);
    }

    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Builds a share link for a product
 * @param prod - Product object with id, category, name, price, currency
 * @returns Telegram share URL
 */
export function buildShareLink(prod: any) {
  const base = 'https://t.me/share/url';
  const url = encodeURIComponent(`https://notstore-contest.vercel.app/product/${prod.id}`);
  const txt = encodeURIComponent(`${prod.category} ${prod.name} – ${prod.price} ${prod.currency}`);
  return `${base}?url=${url}&text=${txt}`;
}

/**
 * Shares a product via Telegram
 * Uses the most appropriate sharing method based on available API version
 * @param prod - Product object to share
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
