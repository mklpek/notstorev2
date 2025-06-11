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

  // Telegram tema renklerini uygula
  useEffect(() => {
    try {
      const wa = window.Telegram?.WebApp;
      if (!wa) return;

      // Tema renklerini CSS değişkenlerine ayarla
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
    } catch {
      /* ignored */
    }
  }, []);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    // Telegram kullanıcı bilgilerini al ve Redux'a kaydet
    const initUser = async () => {
      try {
        const { WebApp: wa } = window.Telegram || { WebApp: undefined };
        if (!wa?.initDataUnsafe?.user) return;

        const user = wa.initDataUnsafe.user;

        // Debug: photo_url'nin gelip gelmediğini kontrol et
        console.log('photo_url →', user.photo_url);

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
        if (user.photo_url) {
          userDetails.photo_url = user.photo_url;
          // Direkt photoUrl'e ekle ve cache'le
          userDetails.photoUrl = user.photo_url;
          localStorage.setItem(`avatar:${user.id}`, user.photo_url);
        }

        // Kullanıcı bilgilerini Redux'a kaydet
        dispatch(setTelegramUser(userDetails));

        // Sadece photo_url yoksa API'den profil fotoğrafını getir
        if (!user.photo_url) {
          // Önce localStorage'da daha önce kaydedilmiş bir URL var mı kontrol et
          const cachedPhotoUrl = localStorage.getItem(`avatar:${user.id}`);

          if (cachedPhotoUrl && cachedPhotoUrl !== 'none') {
            // Cache'den yükle
            dispatch(setUserPhotoUrl(cachedPhotoUrl));
          } else if (cachedPhotoUrl !== 'none') {
            // 'none' değilse API'ye sor
            try {
              // API'den getir
              const photoUrl = await getUserProfilePhoto(user.id);
              if (photoUrl) {
                // Redux'a kaydet
                dispatch(setUserPhotoUrl(photoUrl));
                // localStorage'a cache'le
                localStorage.setItem(`avatar:${user.id}`, photoUrl);
              } else {
                // Profil fotoğrafı yoksa 'none' olarak işaretle, gereksiz API çağrılarını önle
                localStorage.setItem(`avatar:${user.id}`, 'none');
              }
            } catch (error) {
              console.error('Profil fotoğrafı alınırken hata:', error);
              // Hata durumunda 'none' olarak işaretle
              localStorage.setItem(`avatar:${user.id}`, 'none');
            }
          }
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi yüklenirken hata:', error);
      }
    };

    initUser();
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
