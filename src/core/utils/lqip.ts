export const lqip = (src: string, w = 16) => {
  // Eğer src boş veya geçersizse boş string döndür
  if (!src) return '';

  // URL güvenlik kontrolü
  try {
    // URL olarak geçerli mi?
    new URL(src);

    // not-contest-cdn.openbuilders.xyz API'si için özel işlem
    if (src.includes('not-contest-cdn.openbuilders.xyz')) {
      // Bu API resize parametrelerini desteklemiyor olabilir
      // Bunun yerine orijinal URL'i döndürüp CSS blur ile placeholder oluşturacağız
      return src;
    }

    // Diğer URL'ler için genel parametreler
    return `${src}${src.includes('?') ? '&' : '?'}width=${w}&optimize=low&format=webp`;
  } catch (error) {
    // Geçersiz URL ise orijinal src'yi döndür
    console.warn('Geçersiz URL:', src);
    return src;
  }
};
