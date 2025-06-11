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
  console.log('🔄 shareProduct çağrıldı:', { productName, productId });

  try {
    const wa = window.Telegram?.WebApp;
    console.log('📱 Telegram WebApp durumu:', {
      telegramExists: !!window.Telegram,
      webAppExists: !!wa,
      version: wa?.version || 'bilinmiyor',
    });

    if (!wa) {
      console.warn('⚠️ Telegram WebApp bulunamadı - browser ortamında çalışıyor olabilir');
      // Browser ortamında test için alert göster
      alert(
        `Paylaşım: ${productName}\nID: ${productId}\n\nTelegram ortamında çalışırken gerçek paylaşım açılacak.`
      );
      return;
    }

    // Haptic feedback ver (kullanıcı deneyimi için)
    try {
      wa.HapticFeedback?.impactOccurred?.('medium');
    } catch (e) {
      console.log('Haptic feedback desteklenmiyor');
    }

    // Paylaşım URL'ini oluştur
    const shareUrl = `https://t.me/notstore_bot/app?startapp=product_${productId}`;
    const shareText = `${productName} ürününü incele! 🛍️`;

    console.log('🔗 Paylaşım bilgileri:', { shareUrl, shareText });

    // Basit ve güvenilir yöntem: direkt paylaşım linki
    const fullShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

    console.log('🔗 Tam paylaşım URL:', fullShareUrl);

    // Telegram versiyonuna göre en uygun metodu seç
    if (wa.openTelegramLink) {
      console.log('📱 openTelegramLink kullanılıyor');
      wa.openTelegramLink(fullShareUrl);
    } else if (wa.openLink) {
      console.log('🌐 openLink kullanılıyor');
      wa.openLink(fullShareUrl);
    } else {
      console.log('🌐 window.open kullanılıyor (fallback)');
      window.open(fullShareUrl, '_blank');
    }

    // Başarı mesajı (opsiyonel)
    setTimeout(() => {
      try {
        wa.HapticFeedback?.notificationOccurred?.('success');
      } catch (e) {
        console.log('Success haptic desteklenmiyor');
      }
    }, 100);
  } catch (error) {
    console.error('❌ Paylaşım hatası:', error);

    // Hata haptic feedback
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('error');
    } catch (e) {
      console.log('Error haptic desteklenmiyor');
    }

    // Hata durumunda kullanıcıya bilgi ver
    alert(`Paylaşım hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
}

/**
 * Paylaşım linkini açma fonksiyonu
 */
function openShareLink(shareUrl: string, shareText: string): void {
  const wa = window.Telegram?.WebApp;
  if (!wa) return;

  const fullShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  // openTelegramLink öncelikli (Telegram 6.1+)
  if (wa.openTelegramLink) {
    console.log('📱 openTelegramLink kullanılıyor');
    wa.openTelegramLink(fullShareUrl);
  }
  // openLink fallback (Telegram 6.0+)
  else if (wa.openLink) {
    console.log('🌐 openLink kullanılıyor');
    wa.openLink(fullShareUrl);
  }
  // Son çare: window.open
  else {
    console.log('🌐 window.open kullanılıyor');
    window.open(fullShareUrl, '_blank');
  }
}

/**
 * Story paylaşımı veya fallback
 */
function shareToStoryOrFallback(shareUrl: string, shareText: string, productName: string): void {
  const wa = window.Telegram?.WebApp;
  if (!wa) return;

  // shareToStory desteği (Telegram 7.0+)
  if (wa.shareToStory) {
    console.log('📱 shareToStory kullanılıyor');
    wa.shareToStory(shareUrl, {
      text: shareText,
      widget_link: {
        url: shareUrl,
        name: productName,
      },
    });
  } else {
    console.log('📱 shareToStory desteklenmiyor, normal paylaşım kullanılıyor');
    openShareLink(shareUrl, shareText);
  }
}
