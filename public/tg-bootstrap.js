// Telegram Mini App sınıfını HTML'e ekle - CSP uyumlu external script
if (window.Telegram?.WebApp) {
  document.documentElement.classList.add('tg');
}
