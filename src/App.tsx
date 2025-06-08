import { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import CartModal from './features/cart/CartModal';
import AppSkeleton from './components/Skeleton/AppSkeleton';
import ItemPageSkeleton from './components/Skeleton/ItemPageSkeleton';
import AccountPageSkeleton from './components/Skeleton/AccountPageSkeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSkeletonTheme } from './hooks/useSkeletonTheme';
import { TonConnectProvider } from './features/tonConnect';

// Lazy loaded components
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const ProductGrid = lazy(() => import('./features/products/ProductGrid'));
const ItemPage = lazy(() => import('./features/products/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

function App() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  // Skeleton teması değerlerini memoize ediyoruz
  const skeletonTheme = useSkeletonTheme();

  useEffect(() => {
    // Telegram WebApp SDK'sını başlat
    WebApp.ready();
    WebApp.expand();

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
  }, []);

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
