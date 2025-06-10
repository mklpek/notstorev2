import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CartModal from './features/cart/CartModal';
import AppSkeleton from './components/Skeleton/AppSkeleton';
import ItemPageSkeleton from './components/Skeleton/ItemPageSkeleton';
import AccountPageSkeleton from './components/Skeleton/AccountPageSkeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSkeletonTheme } from './hooks/useSkeletonTheme';
import { TonConnectProvider } from './features/tonConnect';
import { useDispatch } from 'react-redux';
import { setTelegramUser, setUserPhotoUrl } from './features/account/userSlice';
import { getUserProfilePhoto } from './api/telegramApi';
import type { TelegramUser } from './features/account/userSlice';

// Lazy loaded components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const ProductGrid = lazy(() => import('./features/products/ProductGrid'));
const ItemPage = lazy(() => import('./features/products/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

function App() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Skeleton teması değerlerini memoize ediyoruz
  const skeletonTheme = useSkeletonTheme();

  useEffect(() => {
    // Telegram WebApp SDK'sını başlat
    try {
      const wa = window.Telegram.WebApp;

      // SDK başlatma
      wa.ready();

      // Şeffaf header rengi
      wa.setHeaderColor('#00000000');

      // İsteğe bağlı: Kapanış onayı etkinleştir
      if (typeof wa.enableClosingConfirmation === 'function') {
        wa.enableClosingConfirmation();
      }

      // Viewport değişimi → CSS değişkenini güncelle
      const vpHandler = ({ height, isStateStable }: ViewportEvent) => {
        if (isStateStable) {
          document.documentElement.style.setProperty('--tg-viewport-height', `${height}px`);
        }
      };

      wa.onEvent('viewport_changed', vpHandler);

      return () => wa.offEvent('viewport_changed', vpHandler);
    } catch (error) {
      console.error('Telegram WebApp API hatası:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const wa = window.Telegram.WebApp;

      // Route'a göre buton görünürlüğü
      const isProductPage = location.pathname.startsWith('/product/');

      if (isProductPage) {
        wa.BackButton.show();
      } else {
        wa.BackButton.hide();
      }

      // Geri butonu olayı
      wa.BackButton.onClick(() => navigate(-1));

      // Ayarlar butonu göster ve olayı
      wa.SettingsButton.show();
      wa.SettingsButton.onClick(() => wa.openLink('https://t.me/notstore_bot'));

      // Temizleme fonksiyonu
      return () => {
        wa.BackButton.offClick(() => navigate(-1));
        wa.SettingsButton.offClick(() => wa.openLink('https://t.me/notstore_bot'));
      };
    } catch (error) {
      console.error('Telegram buton API hatası:', error);
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    // Telegram kullanıcı bilgilerini al ve Redux'a kaydet
    const initUser = async () => {
      try {
        // Eğer bu özellik varsa kullan (WebApp.initDataUnsafe yerine)
        const telegramWebApp = window.Telegram?.WebApp;

        if (telegramWebApp?.initDataUnsafe?.user) {
          const user = telegramWebApp.initDataUnsafe.user;

          // TelegramUser tipine uygun veriyi hazırla
          const userDetails: TelegramUser = {
            id: user.id,
            first_name: user.first_name,
          };

          // Opsiyonel alanları kontrol ederek ekle
          if (user.last_name) userDetails.last_name = user.last_name;
          if (user.username) userDetails.username = user.username;
          if (user.language_code) userDetails.language_code = user.language_code;
          if (user.is_premium !== undefined) userDetails.is_premium = user.is_premium;

          // Önce temel kullanıcı bilgilerini Redux'a kaydet
          dispatch(setTelegramUser(userDetails));

          // Ardından profil fotoğrafını API'den al ve güncelle
          const photoUrl = await getUserProfilePhoto(user.id);
          if (photoUrl) {
            dispatch(setUserPhotoUrl(photoUrl));
          }
        }
      } catch (error) {
        console.error('Telegram kullanıcı bilgileri alınamadı:', error);
      }
    };

    initUser();

    // Telegram tema renklerini uygula
    try {
      const telegramWebApp = window.Telegram?.WebApp;
      if (telegramWebApp?.themeParams) {
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color',
          telegramWebApp.themeParams.bg_color || '#000000'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color',
          telegramWebApp.themeParams.text_color || '#ffffff'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-hint-color',
          telegramWebApp.themeParams.hint_color || 'rgba(255, 255, 255, 0.5)'
        );

        // Safe area için CSS değişkeni tanımla (iOS için)
        document.documentElement.style.setProperty(
          '--tg-safe-area-inset-top',
          'env(safe-area-inset-top)'
        );
      }
    } catch (error) {
      console.error('Telegram tema bilgileri alınamadı:', error);
    }
  }, [dispatch]);

  // Fonksiyonları useCallback ile sarmalıyoruz
  // Sadece bağımlılıkları değiştiğinde yeniden oluşturulurlar
  const handleCartClick = useCallback(() => {
    setIsCartModalOpen(true);
  }, []);

  const handleCartModalClose = useCallback(() => {
    setIsCartModalOpen(false);
  }, []);

  return (
    <TonConnectProvider>
      <SkeletonTheme
        baseColor={skeletonTheme.baseColor}
        highlightColor={skeletonTheme.highlightColor}
        enableAnimation={skeletonTheme.enableAnimation}
        duration={skeletonTheme.animationDuration}
      >
        <Routes>
          {/* Tam-ekran ürün detayı - özel ItemPageSkeleton kullanır */}
          <Route
            path="product/:productId"
            element={
              <Suspense fallback={<ItemPageSkeleton />}>
                <ItemPage />
              </Suspense>
            }
          />

          {/* TabBar + Header barındıran layout - AppSkeleton kullanır */}
          <Route
            element={
              <Suspense fallback={<AppSkeleton />}>
                <MainLayout onCartClick={handleCartClick} />
              </Suspense>
            }
          >
            <Route index element={<ProductGrid />} />
            <Route
              path="profile"
              element={
                <Suspense
                  fallback={<AccountPageSkeleton showHistory={true} historyItemCount={6} />}
                >
                  <AccountPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>

        {/* Modal component - route tabanlı olmayan eski versiyona dönüş */}
        <CartModal isOpen={isCartModalOpen} onClose={handleCartModalClose} />
      </SkeletonTheme>
    </TonConnectProvider>
  );
}

export default App;
