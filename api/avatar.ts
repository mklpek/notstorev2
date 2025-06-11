import type { VercelRequest, VercelResponse } from '@vercel/node';

const BOT_TOKEN = process.env.VITE_BOT_TOKEN || '';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { userId } = request.query;

  if (!userId || !BOT_TOKEN) {
    response.status(400).json({ error: 'Missing userId or bot token' });
    return;
  }

  try {
    // 2.4 Optional ultra-fast shortcut - try the undocumented endpoint first
    const quickUrl = `https://t.me/i/userpic/320/${userId}.jpg`;
    const quickResponse = await fetch(quickUrl, { method: 'HEAD' });

    if (quickResponse.ok) {
      response.setHeader('Cache-Control', 's-maxage=3600'); // 1 hour cache
      response.status(200).json({ photoUrl: quickUrl });
      return;
    }

    // Fallback to official Bot API
    const photosResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`
    );

    if (!photosResponse.ok) {
      response.status(404).json({ error: 'Profile photo not found' });
      return;
    }

    const photosData = await photosResponse.json();

    if (!photosData.result.photos || photosData.result.photos.length === 0) {
      response.status(404).json({ error: 'No profile photos' });
      return;
    }

    // Get highest resolution photo
    const fileId = photosData.result.photos[0][photosData.result.photos[0].length - 1].file_id;

    // Get file path
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    if (!fileResponse.ok) {
      response.status(500).json({ error: 'Failed to get file info' });
      return;
    }

    const fileData = await fileResponse.json();
    const photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileData.result.file_path}`;

    response.setHeader('Cache-Control', 's-maxage=3600'); // 1 hour cache
    response.status(200).json({ photoUrl });
  } catch (error) {
    console.error('Avatar API error:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}
