import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useTelegramHeader = () => {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Telegram WebApp varlık kontrolü
    if (!window.Telegram?.WebApp) {
      console.warn('Telegram WebApp API is not available. Running in browser mode.');
      return;
    }

    const wa = window.Telegram.WebApp;
    wa.ready();
    void (wa.requestFullscreen?.() || wa.expand()); // void kullanarak ESLint hatasını giderdik
    wa.setHeaderColor('#00000000'); // şeffaf header

    // Route bazlı buton mantığı
    const isProduct = pathname.startsWith('/product/');
    if (isProduct) wa.BackButton.show();
    else wa.BackButton.hide();
    wa.SettingsButton.show();

    const handleBack = () => nav(-1);
    const handleSettings = () => wa.openLink('https://t.me/notstore_bot');

    wa.onEvent('back_button_pressed', handleBack);
    wa.onEvent('settings_button_pressed', handleSettings);

    return () => {
      wa.BackButton.hide();
      wa.SettingsButton.hide();
      wa.offEvent('back_button_pressed', handleBack);
      wa.offEvent('settings_button_pressed', handleSettings);
    };
  }, [pathname, nav]);

  // Viewport yüksekliğini güncelleme
  useEffect(() => {
    // Telegram WebApp varlık kontrolü
    if (!window.Telegram?.WebApp) {
      return;
    }

    const wa = window.Telegram.WebApp;
    const setVH = () =>
      document.documentElement.style.setProperty('--tg-viewport-height', `${wa.viewportHeight}px`);

    // İlk render'da ayarla
    setVH();

    // Viewport değişikliklerini dinle
    wa.onEvent('viewport_changed', setVH);

    return () => wa.offEvent('viewport_changed', setVH);
  }, []);
};
