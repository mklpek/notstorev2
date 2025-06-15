/******************************************************************************
 * File: vite-env.d.ts
 * Layer: types
 * Desc: Vite environment types and global type definitions for Telegram WebApp
 ******************************************************************************/

/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

/**
 * Type definitions for SVG sprite plugin
 */
declare module 'virtual:svg-icons-register' {
  const noop: () => void;
  export default noop;
}

/**
 * Vite environment variables interface
 * Defines available environment variables for the application
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_PUBLIC_PATH: string;
  readonly VITE_APP_DESCRIPTION: string;
  readonly VITE_APP_VERSION: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Document {
  addEventListener(
    type: string,
    callback: EventListener | EventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

/**
 * Telegram WebApp user interface
 * Represents user data from Telegram WebApp
 */
interface WebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

/**
 * Telegram WebApp initialization data interface
 * Contains user and chat information
 */
interface WebAppInitData {
  user?: WebAppUser;
  chat_type?: string;
  hash?: string;
  // Other initData fields
}

/**
 * Telegram WebApp button interface
 * Represents interactive buttons in Telegram WebApp
 */
interface TelegramWebAppButton {
  show?: () => void;
  hide?: () => void;
  onClick?: (callback: () => void) => void;
  offClick?: (callback: () => void) => void;
  setText?: (text: string) => void;
  enable?: () => void;
  disable?: () => void;
  showProgress?: (leaveActive?: boolean) => void;
  hideProgress?: () => void;
}

/**
 * Extended Telegram WebApp interface
 * Comprehensive interface for Telegram WebApp API
 */
interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initDataUnsafe: WebAppInitData;
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
    [key: string]: string | undefined;
  };
  // New methods - optional because they may not exist in older versions
  requestFullscreen?: () => void;
  setHeaderColor?: (color: string) => void;
  openLink?: (url: string, options?: { tryInstantView?: boolean }) => void;
  openTelegramLink?: (url: string) => void;
  shareMessage?: (messageId: string, options?: { choose_chat?: boolean }) => void;
  BackButton?: TelegramWebAppButton;
  SettingsButton?: TelegramWebAppButton;
  onEvent?: (eventType: string, handler: (...args: unknown[]) => void) => void;
  offEvent?: (eventType: string, handler: (...args: unknown[]) => void) => void;
  safeAreaInset?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  // Legacy header color API (older versions)
  HeaderColor?: {
    setColor: (color: string) => void;
  };
  // Telegram WebApp 2.0 (Bot API 8.0+) new methods
  requestContentSafeArea?: () => void;
  viewportHeight?: number;
  viewportStableHeight?: number;
  // Other WebApp methods
}

/**
 * Window interface extension for Telegram WebApp
 * Adds Telegram object to global window
 */
interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}
