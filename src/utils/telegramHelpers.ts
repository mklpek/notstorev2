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
 * Ürün paylaşma fonksiyonu - Telegram içi paylaşma
 */
export function shareProduct(productName: string, productId: string): void {
  try {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    // Paylaşım URL'ini oluştur
    const shareUrl = `https://t.me/notstore_bot/app?startapp=product_${productId}`;
    const shareText = `${productName} ürününü incele! 🛍️`;

    // showPopup metodunu kontrol et (Telegram WebApp 6.1+)
    if (canUse('showPopup')) {
      wa.showPopup?.(
        {
          title: 'Ürünü Paylaş',
          message: 'Bu ürünü nasıl paylaşmak istiyorsun?',
          buttons: [
            {
              id: 'share_link',
              type: 'default',
              text: 'Bağlantı Paylaş',
            },
            {
              id: 'share_story',
              type: 'default',
              text: 'Hikayede Paylaş',
            },
            {
              id: 'cancel',
              type: 'cancel',
              text: 'İptal',
            },
          ],
        },
        (buttonId: string) => {
          if (buttonId === 'share_link') {
            // Bağlantı paylaşımı
            if (canUse('openTelegramLink')) {
              wa.openTelegramLink?.(
                `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
              );
            } else if (canUse('openLink')) {
              wa.openLink?.(
                `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
              );
            }
          } else if (buttonId === 'share_story') {
            // Hikaye paylaşımı (Telegram 7.0+)
            if (canUse('shareToStory')) {
              wa.shareToStory?.(shareUrl, {
                text: shareText,
                widget_link: {
                  url: shareUrl,
                  name: productName,
                },
              });
            } else {
              // Fallback: normal paylaşım
              if (canUse('openTelegramLink')) {
                wa.openTelegramLink?.(
                  `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
                );
              }
            }
          }
        }
      );
    } else {
      // Fallback: direkt paylaşım linki aç
      if (canUse('openTelegramLink')) {
        wa.openTelegramLink?.(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        );
      } else if (canUse('openLink')) {
        wa.openLink?.(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        );
      }
    }
  } catch (error) {
    console.error('Paylaşım hatası:', error);
  }
}
