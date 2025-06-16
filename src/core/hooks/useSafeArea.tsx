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

    // 🔧 1) Her zaman önce ready() çağır
    wa.ready();

    /**
     * Updates CSS custom properties with safe area values
     * @param insets - Safe area inset values
     */
    const updateCSSVariables = (insets: SafeAreaInsets) => {
      console.log('🎨 Updating CSS variables:', insets);

      // Mevcut değişkenler (geriye dönük uyumluluk)
      document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${insets.top}px`);
      document.documentElement.style.setProperty('--tg-safe-area-inset-right', `${insets.right}px`);
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-bottom',
        `${insets.bottom}px`
      );
      document.documentElement.style.setProperty('--tg-safe-area-inset-left', `${insets.left}px`);

      // 🔧 2.3) SDK ile senkronize değişkenler (bindViewportCssVars uyumlu)
      ['top', 'right', 'bottom', 'left'].forEach(side =>
        document.documentElement.style.setProperty(
          `--tg-viewport-safe-area-inset-${side}`,
          `${insets[side as keyof SafeAreaInsets]}px`
        )
      );

      // Content safe area (newly added)
      document.documentElement.style.setProperty(
        '--tg-content-safe-area-inset-top',
        `${insets.top}px`
      );
    };

    /**
     * 🔧 2.1) env() okumayı güvenli hâle getir
     * @param name - CSS env() property name
     * @returns Parsed float value or 0
     */
    const readEnv = (name: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return Number.parseFloat(v || '0'); // NaN koruması
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

    // 🔧 2.2) Telegram çağrı sırasını düzelt - mümkünse anında
    if (typeof wa.requestContentSafeArea === 'function') {
      console.log('🚀 Requesting content safe area immediately');
      wa.requestContentSafeArea();
    }

    // ❶ Initial load - Check native env() support (güvenli okuma)
    try {
      console.log('🔍 Reading native env() values...');

      const initialInsets: SafeAreaInsets = {
        top: readEnv('env(safe-area-inset-top)'),
        right: readEnv('env(safe-area-inset-right)'),
        bottom: readEnv('env(safe-area-inset-bottom)'),
        left: readEnv('env(safe-area-inset-left)'),
      };

      console.log('📏 Initial insets from env():', initialInsets);
      updateSafeArea(initialInsets);
    } catch (error) {
      console.log('❌ Error reading env() values:', error);
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

    // 🔧 2.4) Klavye için "geçici" bottom inset - orijinal değeri sakla
    let originalBottom = wa.safeAreaInset?.bottom ?? 0;

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

        // Orijinal bottom değerini güncelle
        if (data.bottom !== undefined) {
          originalBottom = data.bottom;
        }

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
        if (data.bottom !== undefined) {
          updates.bottom = data.bottom;
          originalBottom = data.bottom; // Orijinal değeri güncelle
        }
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
        console.log('🚀 Telegram 8.0+ detected, setting up advanced listeners');

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

    // ❵ Visual Viewport API for keyboard handling (iyileştirilmiş)
    const handleVisualViewportChange = () => {
      if (!window.visualViewport) return;

      const vh = window.visualViewport.height;
      document.documentElement.style.setProperty('--visual-viewport-height', `${vh}px`);

      // 🔧 2.4) Klavye için geçici bottom offset
      const keyboard = window.innerHeight - vh;
      const newBottom = keyboard > 100 ? keyboard : originalBottom;

      console.log('⌨️ Keyboard state:', { keyboard, originalBottom, newBottom });
      updateSafeArea({ bottom: newBottom });
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
