import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

// Lint kuralını tüm dosya için devre dışı bırak

// Lazy loaded components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const ProductGrid = lazy(() => import('./features/products/ProductGrid'));
const ItemPage = lazy(() => import('./features/products/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

// SafeArea interface
interface SafeAreaInsets {
  top: number;
  bottom: number;
  left?: number;
  right?: number;
}

// Telegram BackButton Hook
function useTelegramBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isRoot = location.pathname === '/';

    if (isRoot) {
      // Ana sayfada BackButton gizle
      WebApp.BackButton.hide();

      // Ana sayfada SettingsButton göster - profil sayfasına gider
      if (WebApp.SettingsButton) {
        WebApp.SettingsButton.show();
        WebApp.SettingsButton.onClick(() => navigate('/profile'));
      }
    } else {
      // Alt sayfalarda BackButton göster
      WebApp.BackButton.show();

      // Alt sayfalarda SettingsButton gizle
      if (WebApp.SettingsButton) {
        WebApp.SettingsButton.hide();
      }

      // BackButton tıklandığında navigate(-1) ile geri git
      const handleBackClick = () => navigate(-1);
      WebApp.BackButton.onClick(handleBackClick);

      // Component unmount olduğunda event listener'ı kaldır
      return () => {
        WebApp.BackButton.offClick(handleBackClick);
        if (WebApp.SettingsButton) {
          // @ts-expect-error: Telegram WebApp tiplerinde doğru tanımlanmamış
          WebApp.SettingsButton.offClick();
        }
      };
    }
  }, [location, navigate]);
}

// Safe Area değişikliklerini izleyen hook
function useSafeAreaObserver() {
  useEffect(() => {
    // safeAreaChanged olayını dinle
    const handleSafeAreaChange = (insets: SafeAreaInsets) => {
      if (insets && typeof insets === 'object') {
        if ('top' in insets) {
          document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${insets.top}px`);
        }
        if ('bottom' in insets) {
          document.documentElement.style.setProperty(
            '--tg-safe-area-inset-bottom',
            `${insets.bottom}px`
          );
        }
      }
    };

    // Başlangıçtaki değerleri ayarla
    if (WebApp.safeAreaInset) {
      handleSafeAreaChange(WebApp.safeAreaInset);
    }

    try {
      // @ts-expect-error: Telegram WebApp tiplerinde doğru tanımlanmamış
      WebApp.onEvent('safeAreaChanged', handleSafeAreaChange);

      return () => {
        // @ts-expect-error: Telegram WebApp tiplerinde doğru tanımlanmamış
        WebApp.offEvent('safeAreaChanged', handleSafeAreaChange);
      };
    } catch (e) {
      console.warn('Telegram safeAreaChanged event dinlenemedi:', e);
      return () => {};
    }
  }, []);
}

function App() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Telegram BackButton Hook'unu kullan
  useTelegramBackButton();

  // Safe Area değişikliklerini izle
  useSafeAreaObserver();

  // Skeleton teması değerlerini memoize ediyoruz
  const skeletonTheme = useSkeletonTheme();

  useEffect(() => {
    // Telegram WebApp SDK'sını başlat - expand() çağrısını kaldırdık
    WebApp.ready();

    // Telegram kullanıcı bilgilerini al ve Redux'a kaydet
    const initUser = async () => {
      try {
        // TypeScript null/undefined kontrolü
        if (WebApp?.initDataUnsafe?.user) {
          const user = WebApp.initDataUnsafe.user;

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
    document.documentElement.style.setProperty(
      '--tg-theme-bg-color',
      WebApp.themeParams.bg_color || '#000000'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-text-color',
      WebApp.themeParams.text_color || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--tg-theme-hint-color',
      WebApp.themeParams.hint_color || 'rgba(255, 255, 255, 0.5)'
    );

    // Versiyonu uygunsa şeffaf header ayarla
    try {
      if (WebApp.isVersionAtLeast && WebApp.isVersionAtLeast('6.1')) {
        // @ts-expect-error: 'transparent' string tipini kabul etmeli
        WebApp.setHeaderColor('transparent');
        WebApp.setBackgroundColor('#000000');

        // Üst çubukta başlık ayarla (6.2+ versiyonlarında çalışır)
        if (WebApp.isVersionAtLeast('6.2')) {
          // @ts-expect-error: WebApp.setHeaderTitle tipinde doğru tanımlanmamış
          WebApp.setHeaderTitle('NOT Store');
        }
      }
    } catch (e) {
      console.warn('Telegram header rengi ayarlanamadı:', e);
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
