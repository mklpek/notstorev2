// Telegram algılama ve sınıf ekleme
if (location.search.includes('tg') || (window.Telegram && window.Telegram.WebApp)) {
  // Sadece Telegram içindeyken veya tg query string parametresi varsa .tg sınıfını ekler
  document.documentElement.classList.add('tg');
}
