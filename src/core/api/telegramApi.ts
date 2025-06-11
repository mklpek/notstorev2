/**
 * Telegram API ile iletişim kurarak kullanıcı profil fotoğrafı çekme servisi
 * Artık Edge Function kullanarak bot token'ı server-side'da tutuyor
 */

/**
 * Kullanıcının profil fotoğrafı bilgilerini Edge Function üzerinden çeker
 */
export async function getUserProfilePhoto(userId: number): Promise<string | null> {
  try {
    // Edge Function'ı çağır - bot token server-side'da kalır
    const response = await fetch(`/api/avatar?userId=${userId}`);

    if (!response.ok) {
      console.error('Avatar API hatası:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.photoUrl || null;
  } catch (error) {
    console.error('Avatar API çağrısı hatası:', error);
    return null;
  }
}

/**
 * Telegram initData değerini doğrulama (client-side örneği, gerçekte backend'de yapılmalıdır)
 * NOT: Bu sadece eğitim amaçlıdır. Gerçek bir uygulamada bu işlem backend tarafında yapılmalıdır.
 */
export function validateInitData(initDataString: string): boolean {
  try {
    // Burada gerçek bir doğrulama yapılmıyor, sadece formatı kontrol ediyoruz
    // Gerçek doğrulama backend'de yapılmalıdır
    const params = new URLSearchParams(initDataString);
    return params.has('user') && params.has('hash');
  } catch (error) {
    console.error('InitData doğrulama hatası:', error);
    return false;
  }
}
