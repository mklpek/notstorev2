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

    // Test: Set initial values to verify CSS variable system works
    console.log('🧪 Testing CSS variable system...');
    document.documentElement.style.setProperty('--tg-safe-area-inset-top', '25px', 'important');
    setTimeout(() => {
      const testValue = getComputedStyle(document.documentElement).getPropertyValue(
        '--tg-safe-area-inset-top'
      );
      console.log('🧪 Test CSS variable value:', testValue);
    }, 100);

    /**
     * Updates CSS custom properties with safe area values
     * @param insets - Safe area inset values
     */
    const updateCSSVariables = (insets: SafeAreaInsets) => {
      console.log('🎨 Updating CSS variables:', insets);

      // Use setProperty with priority to override any existing values
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-top',
        `${insets.top}px`,
        'important'
      );
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-right',
        `${insets.right}px`,
        'important'
      );
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-bottom',
        `${insets.bottom}px`,
        'important'
      );
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-left',
        `${insets.left}px`,
        'important'
      );

      // Also add CSS variable for content safe area (newly added)
      document.documentElement.style.setProperty(
        '--tg-content-safe-area-inset-top',
        `${insets.top}px`,
        'important'
      );

      // Debug: Check if CSS variables are actually set
      const topVar = document.documentElement.style.getPropertyValue('--tg-safe-area-inset-top');
      const bottomVar = document.documentElement.style.getPropertyValue(
        '--tg-safe-area-inset-bottom'
      );

      // Also check computed style to see what's actually being used
      const computedStyle = getComputedStyle(document.documentElement);
      const computedTop = computedStyle.getPropertyValue('--tg-safe-area-inset-top');
      const computedBottom = computedStyle.getPropertyValue('--tg-safe-area-inset-bottom');

      console.log('🔍 CSS Variables after update:', {
        topVar,
        bottomVar,
        computedTop,
        computedBottom,
        topValue: insets.top,
        bottomValue: insets.bottom,
      });
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

    // ❶ Initial load - Check native env() support with proper method
    try {
      // Create a temporary element to test env() support
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: fixed;
        top: env(safe-area-inset-top);
        right: env(safe-area-inset-right);
        bottom: env(safe-area-inset-bottom);
        left: env(safe-area-inset-left);
        pointer-events: none;
        visibility: hidden;
      `;
      document.body.appendChild(testElement);

      const computedStyle = getComputedStyle(testElement);
      const envTop = computedStyle.top;
      const envRight = computedStyle.right;
      const envBottom = computedStyle.bottom;
      const envLeft = computedStyle.left;

      document.body.removeChild(testElement);

      console.log('🔍 Native env() values:', { envTop, envRight, envBottom, envLeft });

      const initialInsets: SafeAreaInsets = {
        top: envTop && envTop !== 'auto' ? parseInt(envTop, 10) || 0 : 0,
        right: envRight && envRight !== 'auto' ? parseInt(envRight, 10) || 0 : 0,
        bottom: envBottom && envBottom !== 'auto' ? parseInt(envBottom, 10) || 0 : 0,
        left: envLeft && envLeft !== 'auto' ? parseInt(envLeft, 10) || 0 : 0,
      };

      console.log('📏 Initial insets from env():', initialInsets);
      updateSafeArea(initialInsets);
    } catch (error) {
      console.log('❌ Error reading env() values:', error);
    }

    // ❷ Telegram WebApp safeAreaInset property (if available)
    if (wa.safeAreaInset) {
      console.log('📱 Telegram safeAreaInset:', wa.safeAreaInset);
      console.log('🔍 Telegram safeAreaInset.top specifically:', wa.safeAreaInset.top);
      console.log('🔍 Telegram safeAreaInset.bottom specifically:', wa.safeAreaInset.bottom);

      const telegramInsets = {
        top: wa.safeAreaInset.top || 0,
        right: wa.safeAreaInset.right || 0,
        bottom: wa.safeAreaInset.bottom || 0,
        left: wa.safeAreaInset.left || 0,
      };

      console.log('📱 Processed Telegram insets:', telegramInsets);
      updateSafeArea(telegramInsets);
    } else {
      console.log('⚠️ Telegram safeAreaInset not available');

      // Try to get from Telegram WebApp properties directly
      console.log('🔍 Checking Telegram WebApp object:', {
        hasWebApp: !!wa,
        webAppKeys: wa ? Object.keys(wa) : [],
        safeAreaInset: wa?.safeAreaInset,
        viewportHeight: wa?.viewportHeight,
        viewportStableHeight: wa?.viewportStableHeight,
      });
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
        if (data.top !== undefined) {
          updates.top = data.top;
          console.log('🔝 Top safe area updated via safe_area_changed:', data.top);
        }
        if (data.right !== undefined) updates.right = data.right;
        if (data.bottom !== undefined) {
          updates.bottom = data.bottom;
          console.log('🔽 Bottom safe area updated via safe_area_changed:', data.bottom);
        }
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

      if (data) {
        // Update content safe area CSS variable for top
        if (data.top !== undefined) {
          document.documentElement.style.setProperty(
            '--tg-content-safe-area-inset-top',
            `${data.top}px`
          );
        }

        // Update ALL normal safe area values including TOP
        const updates: Partial<SafeAreaInsets> = {};
        if (data.top !== undefined) updates.top = data.top;
        if (data.right !== undefined) updates.right = data.right;
        if (data.bottom !== undefined) updates.bottom = data.bottom;
        if (data.left !== undefined) updates.left = data.left;

        if (Object.keys(updates).length > 0) {
          console.log('🔄 Updating safe area from content safe area:', updates);
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

    // ❸ Alternative methods for top safe area detection
    const detectTopSafeArea = () => {
      let detectedTop = 0;

      // Method 1: Check if we're in iOS Safari with notch
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const hasNotch =
        window.screen &&
        ((window.screen.height === 812 && window.screen.width === 375) || // iPhone X/XS
          (window.screen.height === 896 && window.screen.width === 414) || // iPhone XR/XS Max
          (window.screen.height === 844 && window.screen.width === 390) || // iPhone 12/13 mini
          (window.screen.height === 926 && window.screen.width === 428) || // iPhone 12/13 Pro Max
          (window.screen.height === 932 && window.screen.width === 430)); // iPhone 14 Pro Max

      if (isIOS && hasNotch) {
        detectedTop = 44; // Standard iOS notch height
        console.log('📱 iOS device with notch detected, setting top safe area to 44px');
      }

      // Method 2: Check viewport vs window height difference
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.outerHeight;
      const heightDiff = windowHeight - viewportHeight;

      if (heightDiff > 20 && heightDiff < 100) {
        detectedTop = Math.max(detectedTop, heightDiff);
        console.log(`📐 Height difference detected: ${heightDiff}px, using as top safe area`);
      }

      // Method 3: Try to detect from Telegram WebApp context
      if (wa && wa.viewportHeight && window.innerHeight) {
        const telegramHeightDiff = window.innerHeight - wa.viewportHeight;
        if (telegramHeightDiff > 0 && telegramHeightDiff < 100) {
          detectedTop = Math.max(detectedTop, telegramHeightDiff);
          console.log(`📱 Telegram viewport difference: ${telegramHeightDiff}px`);
        }
      }

      // Method 4: Force minimum safe area for Telegram WebApp
      if (isIOS && detectedTop === 0) {
        detectedTop = 20; // Minimum safe area for iOS in Telegram
        console.log('📱 iOS detected in Telegram, forcing minimum 20px top safe area');
      }

      // Method 5: Check if we're in fullscreen mode (might indicate safe area needed)
      if (
        (window.navigator as any).standalone ||
        window.matchMedia('(display-mode: standalone)').matches
      ) {
        detectedTop = Math.max(detectedTop, 24);
        console.log('📱 Standalone mode detected, ensuring minimum 24px top safe area');
      }

      if (detectedTop > 0) {
        console.log(`🔍 Alternative top safe area detected: ${detectedTop}px`);
        updateSafeArea({ top: detectedTop });
      } else {
        console.log('⚠️ No top safe area detected, using 0px');
      }
    };

    // Run alternative detection
    detectTopSafeArea();

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
