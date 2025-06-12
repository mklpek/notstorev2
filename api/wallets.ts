/******************************************************************************
 * File: wallets.ts
 * Layer: api
 * Desc: Vercel Edge Function for fetching TON blockchain wallet list with CORS support
 ******************************************************************************/

import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Edge Function handler for fetching TON wallet list
 * Proxies requests to the official TON blockchain wallets repository
 * @param request - Vercel request object
 * @param response - Vercel response object with CORS headers
 * @returns Promise resolving to wallet list JSON or error response
 */
export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/ton-blockchain/wallets-list/main/wallets-v2.json'
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch wallets: ${res.status}`);
    }

    const data = await res.text();

    response.setHeader('Access-Control-Allow-Origin', '*'); // For Telegram iframe
    response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(data);
  } catch (error) {
    console.error('Wallet list fetch error:', error);
    response.status(500).json({
      error: 'Failed to fetch wallet list',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
