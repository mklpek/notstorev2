import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';

export function useTelegramNav() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const back = WebApp.BackButton;
    let mainButtonHandler: (() => void) | null = null;
    let backButtonHandler: (() => void) | null = null;

    // Anasayfadaysa ✕ kapat; iç sayfalarda ◁ geri
    if (pathname === '/') {
      back.hide();
      WebApp.MainButton.setParams({
        text: 'Close',
        is_visible: true,
      });

      mainButtonHandler = WebApp.close;
      WebApp.MainButton.onClick(mainButtonHandler);
    } else {
      WebApp.MainButton.hide();
      back.show();

      backButtonHandler = () => nav(-1);
      back.onClick(backButtonHandler);
    }

    return () => {
      if (backButtonHandler) {
        back.offClick(backButtonHandler);
      }
      if (mainButtonHandler) {
        WebApp.MainButton.offClick(mainButtonHandler);
      }
    };
  }, [pathname, nav]);
}
