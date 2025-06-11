import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout

    const res = await fetch(
      'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Not-Store-TelegramMiniApp/1.0',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch wallets: ${res.status}`);
    }

    const data = await res.text();

    // Agresif caching ile hızlı yanıt sağla
    response.setHeader('Access-Control-Allow-Origin', '*'); // Telegram iframe'i için
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(data);
  } catch (error) {
    console.error('Wallet list fetch error:', error);

    // Hata durumunda fallback olarak boş liste döndürme
    response.status(500).json({
      error: 'Failed to fetch wallet list',
      message: error instanceof Error ? error.message : String(error),
      walletsList: { wallets: [] }, // Boş cevap yerine geçerli boş bir liste gönder
    });
  }
}
