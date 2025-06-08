/**
 * Telegram API ile iletişim kurarak kullanıcı profil fotoğrafı çekme servisi
 */

// Bot token'ı .env dosyasından alıyoruz
const BOT_TOKEN = import.meta.env.VITE_BOT_TOKEN || '';

/**
 * Kullanıcının profil fotoğrafı bilgilerini Telegram API'den çeker
 */
export async function getUserProfilePhoto(userId: number): Promise<string | null> {
  try {
    // Token kontrolü
    if (!BOT_TOKEN) {
      console.error('BOT_TOKEN tanımlanmamış. .env dosyasını kontrol edin.');
      return null;
    }

    // Profil fotoğraflarını al
    const photosResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getUserProfilePhotos?user_id=${userId}&limit=1`
    );

    if (!photosResponse.ok) {
      const errorData = await photosResponse.json();
      console.error('Profil fotoğrafı alınamadı:', errorData);
      return null;
    }

    const photosData = await photosResponse.json();

    // Eğer kullanıcının fotoğrafı yoksa null döndür
    if (!photosData.result.photos || photosData.result.photos.length === 0) {
      return null;
    }

    // En yüksek çözünürlüklü fotoğrafın file_id'sini al (son eleman)
    const fileId = photosData.result.photos[0][photosData.result.photos[0].length - 1].file_id;

    // File ID ile dosya yolunu al
    const fileResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      console.error('Dosya bilgisi alınamadı:', errorData);
      return null;
    }

    const fileData = await fileResponse.json();
    const filePath = fileData.result.file_path;

    // Dosya URL'ini oluştur
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
  } catch (error) {
    console.error('Telegram API hatası:', error);
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
