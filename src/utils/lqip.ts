export const lqip = (src: string, w = 16) => {
  // Eğer src boş veya geçersizse boş string döndür
  if (!src) return '';
  
  // URL güvenlik kontrolü
  try {
    // URL olarak geçerli mi?
    new URL(src);
    
    // URL parametresi ekle
    return `${src}${src.includes('?') ? '&' : '?'}width=${w}&optimize=low&format=webp`;
  } catch (error) {
    // Geçersiz URL ise orijinal src'yi döndür
    console.warn('Geçersiz URL:', src);
    return src;
  }
}; 