/******************************************************************************
 * File: useSafeArea.tsx
 * Layer: core
 * Desc: Safe area management for iOS/Android home indicators and dynamic viewport handling
 ******************************************************************************/

import { useEffect, useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { getTgVersion, safeCall } from '../../utils/telegramHelpers';

// Safe Area Context type
interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Safe Area Context
export const SafeAreaContext = createContext<SafeAreaInsets>({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

// Safe Area Context hook
export const useSafeAreaContext = () => useContext(SafeAreaContext);

/**
 * Combined Safe Area Hook for managing iOS/Android safe areas
 * Handles home indicators, gesture bars, and dynamic viewport changes
 * Supports both native CSS env() values and Telegram WebApp API
 * @returns SafeAreaInsets object with top, right, bottom, left values
 */
export function useSafeAreaInsets() {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) {
      console.log('🚫 Telegram WebApp not available');
      return;
    }

    console.log('🔄 SafeArea: Initializing...');
    const tgVer = getTgVersion();
    console.log('📱 Telegram version:', tgVer);

    /**
     * Updates CSS custom properties with safe area values
     * @param insets - Safe area inset values
     */
    const updateCSSVariables = (insets: SafeAreaInsets) => {
      console.log('🎨 Updating CSS variables:', insets);
      const root = document.documentElement;
      root.style.setProperty('--tg-safe-area-inset-top', `${insets.top}px`);
      root.style.setProperty('--tg-safe-area-inset-right', `${insets.right}px`);
      root.style.setProperty('--tg-safe-area-inset-bottom', `${insets.bottom}px`);
      root.style.setProperty('--tg-safe-area-inset-left', `${insets.left}px`);

      // Also add CSS variable for content safe area (newly added)
      root.style.setProperty('--tg-content-safe-area-inset-top', `${insets.top}px`);
    };

    /**
     * Updates safe area values and CSS variables
     * @param newInsets - Partial safe area inset updates
     */
    const updateSafeArea = (newInsets: Partial<SafeAreaInsets>) => {
      setSafeAreaInsets(prev => {
        const updated = { ...prev, ...newInsets };
        updateCSSVariables(updated);
        return updated;
      });
    };

    /**
     * Updates viewport height CSS variable
     */
    const updateViewportHeight = () => {
      if (wa.viewportHeight) {
        console.log('📐 Viewport height:', wa.viewportHeight);
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${wa.viewportHeight}px`
        );
      }
    };

    // Force immediate Telegram WebApp expansion and safe area request
    try {
      console.log('🚀 Force expanding Telegram WebApp...');
      wa.ready();
      wa.expand();

      // For Telegram 8.0+: Request content safe area immediately and repeatedly
      if (tgVer >= 8.0 && typeof wa.requestContentSafeArea === 'function') {
        console.log('🔄 Requesting content safe area (Telegram 8.0+)');
        wa.requestContentSafeArea();

        // Request again after short delay to ensure it's applied
        setTimeout(() => {
          try {
            if (typeof wa.requestContentSafeArea === 'function') {
              wa.requestContentSafeArea();
              console.log('🔄 Second content safe area request sent');
            }
          } catch (e) {
            console.log('❌ Second content safe area request failed:', e);
          }
        }, 100);
      }
    } catch (e) {
      console.log('❌ Error expanding WebApp:', e);
    }

    // ❶ Initial load - Check native env() support with retry mechanism
    const readEnvValues = () => {
      try {
        const computedStyle = getComputedStyle(document.documentElement);
        const envTop = computedStyle.getPropertyValue('env(safe-area-inset-top)');
        const envRight = computedStyle.getPropertyValue('env(safe-area-inset-right)');
        const envBottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom)');
        const envLeft = computedStyle.getPropertyValue('env(safe-area-inset-left)');

        console.log('🔍 Native env() values:', { envTop, envRight, envBottom, envLeft });

        const initialInsets: SafeAreaInsets = {
          top: envTop ? parseInt(envTop, 10) || 0 : 0,
          right: envRight ? parseInt(envRight, 10) || 0 : 0,
          bottom: envBottom ? parseInt(envBottom, 10) || 0 : 0,
          left: envLeft ? parseInt(envLeft, 10) || 0 : 0,
        };

        console.log('📏 Initial insets from env():', initialInsets);

        // Only update if we got meaningful values
        if (
          initialInsets.top > 0 ||
          initialInsets.bottom > 0 ||
          initialInsets.left > 0 ||
          initialInsets.right > 0
        ) {
          updateSafeArea(initialInsets);
          return true;
        }
        return false;
      } catch (error) {
        console.log('❌ Error reading env() values:', error);
        return false;
      }
    };

    // Try reading env() values immediately and with retries
    let envReadSuccess = readEnvValues();
    if (!envReadSuccess) {
      // Retry after DOM is fully ready
      setTimeout(() => {
        console.log('🔄 Retrying env() values reading...');
        envReadSuccess = readEnvValues();
      }, 50);

      // Another retry after longer delay
      setTimeout(() => {
        if (!envReadSuccess) {
          console.log('🔄 Final attempt to read env() values...');
          readEnvValues();
        }
      }, 200);
    }

    // ❷ Telegram WebApp safeAreaInset property (if available)
    if (wa.safeAreaInset) {
      console.log('📱 Telegram safeAreaInset:', wa.safeAreaInset);
      updateSafeArea({
        top: wa.safeAreaInset.top || 0,
        right: wa.safeAreaInset.right || 0,
        bottom: wa.safeAreaInset.bottom || 0,
        left: wa.safeAreaInset.left || 0,
      });
    } else {
      console.log('⚠️ Telegram safeAreaInset not available');
    }

    // Set initial viewport height
    updateViewportHeight();

    // ❸ Event handlers
    const viewportHandler = () => {
      console.log('📐 Viewport changed');
      updateViewportHeight();
    };

    const safeAreaHandler = (...args: unknown[]) => {
      console.log('🔄 Safe area changed:', args);
      const data = args[0] as
        | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
          }
        | undefined;

      if (data) {
        const updates: Partial<SafeAreaInsets> = {};
        if (data.top !== undefined) updates.top = data.top;
        if (data.right !== undefined) updates.right = data.right;
        if (data.bottom !== undefined) updates.bottom = data.bottom;
        if (data.left !== undefined) updates.left = data.left;

        updateSafeArea(updates);
      }
    };

    // Content Safe Area handler (newly added)
    const contentSafeAreaHandler = (...args: unknown[]) => {
      console.log('🔄 Content safe area changed:', args);
      const data = args[0] as
        | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
          }
        | undefined;

      if (data && data.top !== undefined) {
        // Update content safe area CSS variable
        document.documentElement.style.setProperty(
          '--tg-content-safe-area-inset-top',
          `${data.top}px`
        );

        // Also update normal safe area values
        const updates: Partial<SafeAreaInsets> = {};
        if (data.right !== undefined) updates.right = data.right;
        if (data.bottom !== undefined) updates.bottom = data.bottom;
        if (data.left !== undefined) updates.left = data.left;

        if (Object.keys(updates).length > 0) {
          updateSafeArea(updates);
        }
      }
    };

    // ❹ Listen to Telegram events
    const cleanupFns: (() => void)[] = [];

    try {
      // viewport_changed event - available in all versions
      if (safeCall('onEvent', 'viewport_changed', viewportHandler)) {
        console.log('✅ Listening to viewport_changed');
        cleanupFns.push(() => {
          safeCall('offEvent', 'viewport_changed', viewportHandler);
        });
      }

      // Activate content safe area (Telegram 8.0+)
      if (tgVer >= 8.0) {
        console.log('🚀 Telegram 8.0+ detected, requesting content safe area');
        // Make initial content safe area request
        try {
          if (typeof wa.requestContentSafeArea === 'function') {
            wa.requestContentSafeArea();
            console.log('✅ Content safe area requested');
          }
        } catch (e) {
          console.log('❌ Error requesting content safe area:', e);
        }

        // Listen to content_safe_area_changed event
        if (safeCall('onEvent', 'content_safe_area_changed', contentSafeAreaHandler)) {
          console.log('✅ Listening to content_safe_area_changed');
          cleanupFns.push(() => {
            safeCall('offEvent', 'content_safe_area_changed', contentSafeAreaHandler);
          });
        }
      }

      // safe_area_changed event - only TG >= 8.0
      if (tgVer >= 8.0 && safeCall('onEvent', 'safe_area_changed', safeAreaHandler)) {
        console.log('✅ Listening to safe_area_changed');
        cleanupFns.push(() => {
          safeCall('offEvent', 'safe_area_changed', safeAreaHandler);
        });
      }
    } catch (error) {
      console.log('❌ Error setting up event listeners:', error);
    }

    // ❺ Visual Viewport API for keyboard handling
    const handleVisualViewportChange = () => {
      if (!window.visualViewport) return;

      const vh = window.visualViewport.height;
      document.documentElement.style.setProperty('--visual-viewport-height', `${vh}px`);

      // Update safe area bottom when keyboard appears/disappears
      const keyboardHeight = window.innerHeight - vh;
      if (keyboardHeight > 100) {
        // Keyboard is likely open
        console.log('⌨️ Keyboard detected, height:', keyboardHeight);
        updateSafeArea({ bottom: keyboardHeight });
      } else {
        // Keyboard is likely closed, restore original bottom
        if (wa.safeAreaInset?.bottom !== undefined) {
          console.log('⌨️ Keyboard closed, restoring bottom:', wa.safeAreaInset.bottom);
          updateSafeArea({ bottom: wa.safeAreaInset.bottom });
        }
      }
    };

    if (window.visualViewport) {
      console.log('✅ Visual Viewport API available');
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      cleanupFns.push(() => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
      });
    }

    return () => {
      console.log('🧹 Cleaning up safe area listeners');
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return safeAreaInsets;
}

interface SafeAreaProviderProps {
  children: ReactNode;
}

/**
 * Safe Area Provider component
 * Provides safe area context to child components
 * @param children - Child components to receive safe area context
 * @returns JSX element with SafeAreaContext.Provider
 */
export function SafeAreaProvider({ children }: SafeAreaProviderProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return <SafeAreaContext.Provider value={safeAreaInsets}>{children}</SafeAreaContext.Provider>;
}

// Default export
export { useSafeAreaInsets as default };
