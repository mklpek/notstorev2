import { useEffect, useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { getTgVersion, safeCall } from '../utils/telegramHelpers';

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
    // .tg sınıfı yoksa hiçbir şey yapma (localhost / web önizleme)
    if (!document.documentElement.classList.contains('tg')) return;

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
      const sa = wa.safeAreaInset;
      // Telegram değerlerini CSS değişkenlerine kopyala ve env() ile de senkronize et
      ['top', 'right', 'bottom', 'left'].forEach(side => {
        // TypeScript için doğru tip erişimi
        const sideKey = side as keyof typeof sa;
        const value = sa[sideKey] || 0;
        const px = `${value}px`;

        // Telegram safe area değerlerini CSS değişkenlerine kopyala
        document.documentElement.style.setProperty(`--tg-safe-area-inset-${side}`, px);

        // env() değerleriyle karşılaştırarak, her zaman en büyük değeri kullan
        if (side === 'left' || side === 'right') {
          document.documentElement.style.setProperty(
            `padding-inline-${side === 'left' ? 'start' : 'end'}`,
            `max(${px}, env(safe-area-inset-${side}, 0px))`
          );
        } else {
          document.documentElement.style.setProperty(
            `padding-block-${side === 'top' ? 'start' : 'end'}`,
            `max(${px}, env(safe-area-inset-${side}, 0px))`
          );
        }
      });

      updateSafeArea({
        top: sa.top || 0,
        right: sa.right || 0,
        bottom: sa.bottom || 0,
        left: sa.left || 0,
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

    // ❹ Telegram event'lerini dinle
    const cleanupFns: (() => void)[] = [];

    try {
      // viewport_changed eventi - tüm versiyonlarda mevcut
      if (safeCall('onEvent', 'viewport_changed', viewportHandler)) {
        cleanupFns.push(() => {
          safeCall('offEvent', 'viewport_changed', viewportHandler);
        });
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
