import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import CartModal from './features/cart/CartModal';
import AppSkeleton from './core/ui/Skeleton/AppSkeleton';
import ItemPageSkeleton from './core/ui/Skeleton/ItemPageSkeleton';
import AccountPageSkeleton from './core/ui/Skeleton/AccountPageSkeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSkeletonTheme } from './core/hooks/useSkeletonTheme';
import { TonConnectProvider } from './features/tonConnect';
import { useDispatch } from 'react-redux';
import { setTelegramUser, setUserPhotoUrl } from './features/account/userSlice';
import { getUserProfilePhoto } from './core/api/telegramApi';
import type { TelegramUser } from './features/account/userSlice';
import useTelegramHeader from './core/hooks/useTelegramHeader';

// Lazy loaded components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const ProductGrid = lazy(() => import('./features/catalogue/ProductGrid'));
const ItemPage = lazy(() => import('./features/catalogue/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

function App() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Telegram header hook'unu kullan - tüm kontroller bu hook içerisinde
  useTelegramHeader();

  // Skeleton teması değerlerini memoize ediyoruz
  const skeletonTheme = useSkeletonTheme();

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const initializeTelegram = async () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const wa = window.Telegram.WebApp;

        // Telegram WebApp'i başlat
        wa.ready();

        // Telegram kullanıcı bilgilerini al
        const user = wa.initDataUnsafe?.user as TelegramUser | undefined;

        if (user) {
          // Redux'a kullanıcı bilgilerini kaydet
          dispatch(setTelegramUser(user));

          // 2.1 Try the cheap path first - photo_url from initDataUnsafe
          if (user.photo_url) {
            dispatch(setUserPhotoUrl(user.photo_url));
          } else {
            // 2.2 Fallback - Bot API ile profil fotoğrafı çek
            try {
              const photoUrl = await getUserProfilePhoto(user.id);
              if (photoUrl) {
                dispatch(setUserPhotoUrl(photoUrl));
              }
            } catch (error) {
              console.error('Profil fotoğrafı alınamadı:', error);
            }
          }
        }

        // Telegram tema renklerini uygula
        if (wa.themeParams) {
          const root = document.documentElement;
          if (wa.themeParams.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', wa.themeParams.bg_color);
          }
          if (wa.themeParams.text_color) {
            root.style.setProperty('--tg-theme-text-color', wa.themeParams.text_color);
          }
          if (wa.themeParams.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', wa.themeParams.hint_color);
          }
          if (wa.themeParams.link_color) {
            root.style.setProperty('--tg-theme-link-color', wa.themeParams.link_color);
          }
          if (wa.themeParams.button_color) {
            root.style.setProperty('--tg-theme-button-color', wa.themeParams.button_color);
          }
          if (wa.themeParams.button_text_color) {
            root.style.setProperty(
              '--tg-theme-button-text-color',
              wa.themeParams.button_text_color
            );
          }
        }
      }
    };

    initializeTelegram();
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
