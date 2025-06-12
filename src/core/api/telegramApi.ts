/******************************************************************************
 * File: telegramApi.ts
 * Layer: api
 * Desc: Telegram Bot API integration for user profile photo retrieval and validation
 ******************************************************************************/

/**
 * Service for communicating with Telegram API to fetch user profile photos
 */

// Bot token from .env file
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN || '';

/**
 * Fetches user profile photo information from Telegram API
 * @param userId - Telegram user ID
 * @returns Promise resolving to photo URL or null if not available
 */
export async function getUserProfilePhoto(userId: number): Promise<string | null> {
  try {
    // Token validation
    if (!BOT_TOKEN) {
      console.error('BOT_TOKEN is not defined. Check your .env file.');
      return null;
    }

    // Get profile photos
    const photosResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`
    );

    if (!photosResponse.ok) {
      const errorData = await photosResponse.json();
      console.error('Failed to fetch profile photo:', errorData);
      return null;
    }

    const photosData = await photosResponse.json();

    // Return null if user has no photos
    if (!photosData.result.photos || photosData.result.photos.length === 0) {
      return null;
    }

    // Get file_id of highest resolution photo (last element)
    const fileId = photosData.result.photos[0][photosData.result.photos[0].length - 1].file_id;

    // Get file path using file ID
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      console.error('Failed to get file information:', errorData);
      return null;
    }

    const fileData = await fileResponse.json();
    const filePath = fileData.result.file_path;

    // Construct file URL
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  } catch (error) {
    console.error('Telegram API error:', error);
    return null;
  }
}

/**
 * Validates Telegram initData value (client-side example, should be done on backend in production)
 * NOTE: This is for educational purposes only. In a real application, this validation should be performed on the backend.
 * @param initDataString - Telegram initData string to validate
 * @returns Boolean indicating if initData format is valid
 */
export function validateInitData(initDataString: string): boolean {
  try {
    // No real validation is performed here, only format checking
    // Real validation should be done on the backend
    const params = new URLSearchParams(initDataString);
    return params.has('user') && params.has('hash');
  } catch (error) {
    console.error('InitData validation error:', error);
    return false;
  }
}
