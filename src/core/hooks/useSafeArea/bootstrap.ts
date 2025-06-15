/**
 * Bootstrap safe area insets for Telegram WebApp
 * This file is loaded early to set CSS variables before the app renders
 */

// Safe Area Context type
interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Updates CSS custom properties with safe area values
 * @param insets - Safe area inset values
 */
const updateCSSVariables = (insets: SafeAreaInsets) => {
  console.log('[Bootstrap] Updating CSS variables:', insets);
  document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${insets.top}px`);
  document.documentElement.style.setProperty('--tg-safe-area-inset-right', `${insets.right}px`);
  document.documentElement.style.setProperty('--tg-safe-area-inset-bottom', `${insets.bottom}px`);
  document.documentElement.style.setProperty('--tg-safe-area-inset-left', `${insets.left}px`);
  document.documentElement.style.setProperty('--tg-content-safe-area-inset-top', `${insets.top}px`);
};

/**
 * Bootstrap safe area insets from env() and Telegram WebApp API
 * Called before React renders to set CSS variables early
 */
export function bootstrapSafeArea() {
  console.log('[Bootstrap] Initializing safe area...');

  // Get Telegram WebApp object
  const wa = window.Telegram?.WebApp;

  // Initial insets with zeros
  const insets: SafeAreaInsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  // Try to read env() values first
  try {
    const computedStyle = getComputedStyle(document.documentElement);
    const envTop = computedStyle.getPropertyValue('env(safe-area-inset-top)');
    const envRight = computedStyle.getPropertyValue('env(safe-area-inset-right)');
    const envBottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom)');
    const envLeft = computedStyle.getPropertyValue('env(safe-area-inset-left)');

    console.log('[Bootstrap] Native env() values:', { envTop, envRight, envBottom, envLeft });

    // Parse env values
    if (envTop) insets.top = parseFloat(envTop) || 0;
    if (envRight) insets.right = parseFloat(envRight) || 0;
    if (envBottom) insets.bottom = parseFloat(envBottom) || 0;
    if (envLeft) insets.left = parseFloat(envLeft) || 0;
  } catch (error) {
    console.log('[Bootstrap] Error reading env() values:', error);
  }

  // If Telegram WebApp API is available, use its values
  if (wa?.safeAreaInset) {
    console.log('[Bootstrap] Telegram safeAreaInset:', wa.safeAreaInset);
    if (wa.safeAreaInset.top !== undefined) insets.top = wa.safeAreaInset.top;
    if (wa.safeAreaInset.right !== undefined) insets.right = wa.safeAreaInset.right;
    if (wa.safeAreaInset.bottom !== undefined) insets.bottom = wa.safeAreaInset.bottom;
    if (wa.safeAreaInset.left !== undefined) insets.left = wa.safeAreaInset.left;
  }

  // Android statusBar height tahmini
  if (wa?.platform === 'android' && insets.top === 0) {
    console.log('[Bootstrap] Android platform detected with zero top inset');
    const statusBarHeight = Math.max(0, window.outerHeight - window.innerHeight);
    if (statusBarHeight > 0) {
      console.log('[Bootstrap] Estimated Android status bar height:', statusBarHeight);
      insets.top = statusBarHeight;
    }
  }

  // Update CSS variables
  updateCSSVariables(insets);
  console.log('[Bootstrap] Safe area initialized:', insets);
}
