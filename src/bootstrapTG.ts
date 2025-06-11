// Telegram algılama ve sınıf ekleme
// Uygulama başlatılmadan önce çalışır, CSP kontrollerinden sonra ama React render edilmeden önce
if (location.search.includes('tg') || window.Telegram?.WebApp) {
  // Sadece Telegram içindeyken veya tg query string parametresi varsa .tg sınıfını ekler
  document.documentElement.classList.add('tg');
}
