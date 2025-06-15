/******************************************************************************
 * File: App.tsx
 * Layer: main
 * Desc: Main application component with routing, theming, and Telegram integration
 ******************************************************************************/

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
import type { TelegramUser } from './features/account/userSlice';
import useTelegramHeader from './core/hooks/useTelegramHeader';

// Telegram Apps SDK imports
import {
  bindMiniAppCssVars,
  bindViewportCssVars,
  bindThemeParamsCssVars,
  init,
  miniApp,
  viewport,
} from '@telegram-apps/sdk-react';

// Lazy loaded components for code splitting
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const ProductGrid = lazy(() => import('./features/catalogue/ProductGrid'));
const ItemPage = lazy(() => import('./features/catalogue/components/ItemPage'));
const AccountPage = lazy(() => import('./features/account/AccountPage'));

/**
 * Main application component
 * Handles routing, theming, Telegram integration, and global state management
 * @returns JSX element containing the entire application
 */
function App() {
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Use Telegram header hook - all controls are within this hook
  useTelegramHeader();

  // Memoize skeleton theme values for performance
  const skeletonTheme = useSkeletonTheme();

  // Initialize Telegram Apps SDK
  useEffect(() => {
    try {
      console.log('🚀 Initializing Telegram Apps SDK...');

      // Initialize SDK
      init();
      console.log('✅ SDK initialized');

      // Mount viewport and bind CSS variables
      if (viewport.mount.isAvailable()) {
        viewport.mount();
        bindViewportCssVars();
        console.log('✅ Viewport mounted and CSS vars bound');
      }

      // Mount mini app and bind CSS variables
      if (miniApp.mount.isAvailable()) {
        miniApp.mount();
        bindMiniAppCssVars();
        bindThemeParamsCssVars();
        console.log('✅ MiniApp mounted and theme CSS vars bound');
      }

      // Manual CSS variable binding for safe areas
      const wa = window.Telegram?.WebApp;
      if (wa) {
        const { safeAreaInset, contentSafeAreaInset } = wa;

        for (const k of ['top', 'right', 'bottom', 'left']) {
          document.documentElement.style.setProperty(
            `--tg-viewport-safe-area-inset-${k}`,
            `${safeAreaInset?.[k as keyof typeof safeAreaInset] || 0}px`
          );
          document.documentElement.style.setProperty(
            `--tg-viewport-content-safe-area-inset-${k}`,
            `${contentSafeAreaInset?.[k as keyof typeof contentSafeAreaInset] || 0}px`
          );
        }
        console.log('✅ Safe area CSS variables set:', { safeAreaInset, contentSafeAreaInset });
      }
    } catch (error) {
      console.log('❌ SDK initialization error:', error);
    }
  }, []);

  // Telegram WebApp cache busting and initialization
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    // Force cache clear on app start for development
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.log('🔄 Development mode: Clearing all caches');
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    }

    // Version-based cache busting
    const buildTimestamp = document
      .querySelector('meta[name="build-timestamp"]')
      ?.getAttribute('content');
    const storedTimestamp = localStorage.getItem('app-build-timestamp');

    if (buildTimestamp && storedTimestamp && storedTimestamp !== buildTimestamp) {
      console.log('🔄 New build detected: Clearing caches');
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    }

    if (buildTimestamp) {
      localStorage.setItem('app-build-timestamp', buildTimestamp);
    }

    // Apply Telegram theme colors - PRODUCTION MODE ACTIVE
    try {
      // Set theme colors as CSS variables
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
      // ignored
    }
  }, []);

  // Get Telegram user information
  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa?.initDataUnsafe?.user) return;

    const telegramUser = wa.initDataUnsafe.user;

    const user: TelegramUser = {
      id: telegramUser.id,
      first_name: telegramUser.first_name,
      ...(telegramUser.last_name && { last_name: telegramUser.last_name }),
      ...(telegramUser.username && { username: telegramUser.username }),
      ...(telegramUser.language_code && { language_code: telegramUser.language_code }),
      ...(telegramUser.is_premium !== undefined && { is_premium: telegramUser.is_premium }),
    };

    dispatch(setTelegramUser(user));

    // Get user photo if available
    if (user.id) {
      fetch(
        `https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/getUserProfilePhotos?user_id=${user.id}&limit=1`
      )
        .then(response => response.json())
        .then(data => {
          if (data.ok && data.result.total_count > 0) {
            const fileId = data.result.photos[0][0].file_id;
            return fetch(
              `https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/getFile?file_id=${fileId}`
            );
          }
          return null;
        })
        .then(response => response?.json())
        .then(data => {
          if (data?.ok) {
            const photoUrl = `https://api.telegram.org/file/bot${import.meta.env.VITE_BOT_TOKEN}/${data.result.file_path}`;
            dispatch(setUserPhotoUrl(photoUrl));
          }
        })
        .catch(() => {
          // Ignore photo fetch errors
        });
    }
  }, [dispatch]);

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
          {/* Full-screen product detail - uses special ItemPageSkeleton */}
          <Route
            path="product/:productId"
            element={
              <Suspense fallback={<ItemPageSkeleton />}>
                <ItemPage />
              </Suspense>
            }
          />

          {/* Layout containing TabBar + Header - uses AppSkeleton */}
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

        {/* Modal component - return to non-route based old version */}
        <CartModal isOpen={isCartModalOpen} onClose={handleCartModalClose} />
      </SkeletonTheme>
    </TonConnectProvider>
  );
}

export default App;
