import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
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

  // Tema değişikliğini işleyen fonksiyon
  const applyTelegramTheme = useCallback((wa: typeof window.Telegram.WebApp) => {
    // Tema renklerini CSS değişkenlerine uygula
    document.documentElement.style.setProperty(
      '--tg-theme-bg-color',
      wa.themeParams.bg_color || '#000000'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-text-color',
      wa.themeParams.text_color || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-hint-color',
      wa.themeParams.hint_color || 'rgba(255, 255, 255, 0.5)'
    );

    // Viewport yüksekliği güncelle (Android navbar için)
    document.documentElement.style.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
  }, []);

  useEffect(() => {
    // Telegram WebApp SDK'sını başlat
    const wa = window.Telegram.WebApp;
    wa.ready();

    // Tam ekran başlat
    wa.requestFullscreen();

    // Şeffaf header rengi - beyaz ikonlar için koyu gölge
    wa.setHeaderColor('#00000000'); // RGBA => tam şeffaf

    // Sol üst buton - Sadece kök dizinde değilse göster
    const shouldShowBackButton = location.pathname !== '/';

    if (shouldShowBackButton) {
      wa.BackButton.show();
    } else {
      wa.BackButton.hide();
    }

    const backHandler = () => navigate(-1);
    wa.onEvent('back_button_pressed', backHandler);

    // Sağ üst üç-nokta menüsü
    wa.SettingsButton.show();
    const settingsHandler = () => wa.openLink('https://t.me/notstore_bot');
    wa.onEvent('settings_button_pressed', settingsHandler);

    // Telegram kullanıcı bilgilerini al ve Redux'a kaydet
    const initUser = async () => {
      try {
        // TypeScript null/undefined kontrolü
        if (wa.initDataUnsafe?.user) {
          const user = wa.initDataUnsafe.user;

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

    // İlk uygulama
    applyTelegramTheme(wa);

    // Tema değişikliği olayını dinle
    const themeChangeHandler = () => {
      applyTelegramTheme(wa);
    };

    wa.onEvent('theme_changed', themeChangeHandler);

    // Pencere boyutu değiştiğinde viewport yüksekliği güncelle
    const handleResize = () => {
      document.documentElement.style.setProperty('--tg-viewport-height', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', handleResize);

    // Temizleme fonksiyonu
    return () => {
      wa.BackButton.hide();
      wa.SettingsButton.hide();
      wa.offEvent('back_button_pressed', backHandler);
      wa.offEvent('settings_button_pressed', settingsHandler);
      wa.offEvent('theme_changed', themeChangeHandler);
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch, navigate, location.pathname, applyTelegramTheme]);

  // Konum değişimini izleyen etki - BackButton kontrolü
  useEffect(() => {
    // Ana sayfada geri butonu gizle, diğer sayfalarda göster
    const wa = window.Telegram.WebApp;

    if (location.pathname === '/') {
      wa.BackButton.hide();
    } else {
      wa.BackButton.show();
    }
  }, [location.pathname]);

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
