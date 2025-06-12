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
import { getUserProfilePhoto } from './core/api/telegramApi';
import type { TelegramUser } from './features/account/userSlice';
import useTelegramHeader from './core/hooks/useTelegramHeader';

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

  // Apply Telegram theme colors
  useEffect(() => {
    try {
      const wa = window.Telegram?.WebApp;
      if (!wa) return;

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
      /* ignored */
    }
  }, []);

  // Load user information from Telegram WebApp
  useEffect(() => {
    /**
     * Initialize user data from Telegram WebApp
     * Handles user profile, photo caching, and Redux state updates
     */
    const initUser = async () => {
      try {
        const { WebApp: wa } = window.Telegram || { WebApp: undefined };
        if (!wa?.initDataUnsafe?.user) return;

        const user = wa.initDataUnsafe.user;
        const cachedPhoto = localStorage.getItem(`avatar:${user.id}`);

        if (cachedPhoto) {
          dispatch(setUserPhotoUrl(cachedPhoto));
        }

        // Prepare data according to TelegramUser type
        const userDetails: TelegramUser = {
          id: user.id,
          first_name: user.first_name,
        };

        // Add optional fields after checking
        if (user.last_name) userDetails.last_name = user.last_name;
        if (user.username) userDetails.username = user.username;
        if (user.language_code) userDetails.language_code = user.language_code;
        if (user.is_premium !== undefined) userDetails.is_premium = user.is_premium;
        if (user.photo_url) userDetails.photo_url = user.photo_url;
        if (cachedPhoto) userDetails.cachedPhotoUrl = cachedPhoto;

        dispatch(setTelegramUser(userDetails));

        // Fast path: if photo_url exists, use immediately and cache
        if (user.photo_url) {
          dispatch(setUserPhotoUrl(user.photo_url));
          localStorage.setItem(`avatar:${user.id}`, user.photo_url);
          return; // Skip Bot API call
        }

        // Fallback: if no photo_url and cache is empty, call API
        if (!cachedPhoto) {
          const photoUrl = await getUserProfilePhoto(user.id);
          const finalPhotoUrl = photoUrl ?? 'none'; // Cache as 'none' if no API response
          localStorage.setItem(`avatar:${user.id}`, finalPhotoUrl);
          dispatch(setUserPhotoUrl(finalPhotoUrl));
        }
      } catch (error) {
        console.error('Failed to initialize user:', error);
      }
    };

    initUser();
  }, [dispatch]);

  // Wrap functions with useCallback for performance
  // They will only be recreated when dependencies change
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
