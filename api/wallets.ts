import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // CORS için ön-kontrol yanıtı
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response.status(200).end();
  }

  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json'
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch wallets: ${res.status}`);
    }

    const data = await res.text();

    // CORS ve caching header'ları
    response.setHeader('Access-Control-Allow-Origin', '*'); // Telegram iframe'i için
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(data);
  } catch (error) {
    console.error('Wallet list fetch error:', error);

    // CORS header'ları hata durumunda da ekle
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');

    response.status(500).json({
      error: 'Failed to fetch wallet list',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
