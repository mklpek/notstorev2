import { useEffect, useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { getTgVersion, safeCall } from '../../utils/telegramHelpers';

// Safe Area Context tipi
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

// Safe Area Context hook'u
export const useSafeAreaContext = () => useContext(SafeAreaContext);

// Birleşik Safe Area Hook - önce export ediyoruz
export function useSafeAreaInsets() {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const wa = window.Telegram?.WebApp;
    if (!wa) return;

    // Desktop/tablet'te erken çık
    if (window.visualViewport && window.visualViewport.height > 900) return;

    const tgVer = getTgVersion();

    // CSS değişkenlerini güncelleme fonksiyonu
    const updateCSSVariables = (insets: SafeAreaInsets) => {
      document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${insets.top}px`);
      document.documentElement.style.setProperty('--tg-safe-area-inset-right', `${insets.right}px`);
      document.documentElement.style.setProperty(
        '--tg-safe-area-inset-bottom',
        `${insets.bottom}px`
      );
      document.documentElement.style.setProperty('--tg-safe-area-inset-left', `${insets.left}px`);

      // Ayrıca content safe area için CSS değişkeni ekle (yeni eklenen)
      document.documentElement.style.setProperty(
        '--tg-content-safe-area-inset-top',
        `${insets.top}px`
      );
    };

    // Safe area değerlerini güncelleme fonksiyonu
    const updateSafeArea = (newInsets: Partial<SafeAreaInsets>) => {
      setSafeAreaInsets(prev => {
        const updated = { ...prev, ...newInsets };
        updateCSSVariables(updated);
        return updated;
      });
    };

    // Viewport yüksekliğini güncelleme
    const updateViewportHeight = () => {
      if (wa.viewportHeight) {
        document.documentElement.style.setProperty(
          '--tg-viewport-height',
          `${wa.viewportHeight}px`
        );
      }
    };

    // ❶ İlk yükleme - Native env() desteği kontrol et
    try {
      const computedStyle = getComputedStyle(document.documentElement);
      const envTop = computedStyle.getPropertyValue('env(safe-area-inset-top)');
      const envRight = computedStyle.getPropertyValue('env(safe-area-inset-right)');
      const envBottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom)');
      const envLeft = computedStyle.getPropertyValue('env(safe-area-inset-left)');

      const initialInsets: SafeAreaInsets = {
        top: envTop ? parseInt(envTop, 10) || 0 : 0,
        right: envRight ? parseInt(envRight, 10) || 0 : 0,
        bottom: envBottom ? parseInt(envBottom, 10) || 0 : 0,
        left: envLeft ? parseInt(envLeft, 10) || 0 : 0,
      };

      updateSafeArea(initialInsets);
    } catch {
      /* ignored */
    }

    // ❷ Telegram WebApp safeAreaInset özelliği (varsa)
    if (wa.safeAreaInset) {
      updateSafeArea({
        top: wa.safeAreaInset.top || 0,
        right: wa.safeAreaInset.right || 0,
        bottom: wa.safeAreaInset.bottom || 0,
        left: wa.safeAreaInset.left || 0,
      });
    }

    // İlk viewport yüksekliğini ayarla
    updateViewportHeight();

    // ❸ Event handler'ları
    const viewportHandler = () => {
      updateViewportHeight();
    };

    const safeAreaHandler = (...args: unknown[]) => {
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

    // Content Safe Area handler'ı (yeni eklenen)
    const contentSafeAreaHandler = (...args: unknown[]) => {
      const data = args[0] as
        | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
          }
        | undefined;

      if (data && data.top !== undefined) {
        // Content safe area CSS değişkenini güncelle
        document.documentElement.style.setProperty(
          '--tg-content-safe-area-inset-top',
          `${data.top}px`
        );

        // Normal safe area değerlerini de güncelle
        const updates: Partial<SafeAreaInsets> = {};
        if (data.right !== undefined) updates.right = data.right;
        if (data.bottom !== undefined) updates.bottom = data.bottom;
        if (data.left !== undefined) updates.left = data.left;

        if (Object.keys(updates).length > 0) {
          updateSafeArea(updates);
        }
      }
    };

    // ❹ Telegram event'lerini dinle
    const cleanupFns: (() => void)[] = [];

    try {
      // viewport_changed eventi - tüm versiyonlarda mevcut
      if (safeCall('onEvent', 'viewport_changed', viewportHandler)) {
        cleanupFns.push(() => {
          safeCall('offEvent', 'viewport_changed', viewportHandler);
        });
      }

      // Content safe area'yı aktif et (Telegram 8.0+)
      if (tgVer >= 8.0) {
        // İlk content safe area isteğini yap
        try {
          // @ts-expect-error: Telegram.WebApp tiplerinde bu metot henüz tanımlı değil
          if (typeof wa.requestContentSafeArea === 'function') {
            wa.requestContentSafeArea();
          }
        } catch (e) {
          // Hata durumunda sessizce devam et
        }

        // content_safe_area_changed event'ini dinle
        if (safeCall('onEvent', 'content_safe_area_changed', contentSafeAreaHandler)) {
          cleanupFns.push(() => {
            safeCall('offEvent', 'content_safe_area_changed', contentSafeAreaHandler);
          });
        }
      }

      // safe_area_changed eventi - sadece TG >= 8.0
      if (tgVer >= 8.0 && safeCall('onEvent', 'safe_area_changed', safeAreaHandler)) {
        cleanupFns.push(() => {
          safeCall('offEvent', 'safe_area_changed', safeAreaHandler);
        });
      }
    } catch {
      /* ignored */
    }

    // ❺ Fallback: window.visualViewport API (throttled) - sadece mobile'da
    let rafId: number;
    const handleVisualViewportChange = () => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (window.visualViewport) {
          const vvHeight = window.visualViewport.height;
          const windowHeight = window.innerHeight;
          const bottomInset = Math.max(0, windowHeight - vvHeight);

          updateSafeArea({ bottom: bottomInset });
        }
      });
    };

    // Sadece mobile viewport'larda dinle ve Telegram event'i yoksa
    // safeCall ile onEvent desteğini kontrol et
    const hasEventSupport = safeCall('onEvent', 'test', () => {}) !== undefined;
    if (window.visualViewport && window.visualViewport.height < 900 && !hasEventSupport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      cleanupFns.push(() => {
        if (rafId) cancelAnimationFrame(rafId);
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
      });
    }

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return safeAreaInsets;
}

// SafeAreaProvider bileşeni
interface SafeAreaProviderProps {
  children: ReactNode;
}

export function SafeAreaProvider({ children }: SafeAreaProviderProps) {
  const safeAreaInsets = useSafeAreaInsets();

  return <SafeAreaContext.Provider value={safeAreaInsets}>{children}</SafeAreaContext.Provider>;
}

// Default export
export { useSafeAreaInsets as default };
